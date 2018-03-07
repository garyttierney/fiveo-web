import TextEncoder = TextEncoding.TextEncoder;
import { Match } from "../index";
import { FiveoFfi, FiveoSuccess, NullPointer, Pointer } from "./ffi/api";
const encoder = new TextEncoder("utf-8");

/**
 *  Internal interface to the libfiveo matcher that keeps track of memory references to symbols returned by the FFI.
 */
export default class MatcherBinding {

    /**
     * A local index of the strings indexed by the internal matcher to avoid copies to get match results.
     */
    private dictionary: string[];

    /**
     * Access to the memory buffer used by the WebAssembly module.
     */
    private memory: WebAssembly.Memory;

    /**
     * The foreign function interface to fiveo's C API loaded as a WebAssembly module.
     */
    private api: FiveoFfi;

    /**
     * A reference to the address of the initialized matcher.
     */
    private matcherPtr: Pointer = NullPointer;

    /**
     * The decoder used to decode input text from UTF-8
     */
    private textDecoder: TextEncoding.TextDecoder;

    /**
     * The encoder used to encode input text to UTF-8.
     */
    private textEncoder: TextEncoding.TextEncoder;

    /**
     * The map that the binding expects the callback to store search results in.
     */
    private resultBuffer: Map<number, Match[]> = new Map();

    /**
     * A view into the modules memory.
     */
    private memoryView: Uint8Array;

    /**
     * Construct a new {@link MatcherBinding} with the given encoders.
     *
     * @param {TextEncoding.TextDecoder} textDecoder
     * @param {TextEncoding.TextEncoder} textEncoder
     * @param resultBuffer A mapping of search tokens to a list of results.  This is a reference to the Map populated
     * by the `handle_search_result` callback.
     */
    constructor(textDecoder: TextEncoding.TextDecoder, textEncoder: TextEncoding.TextEncoder) {
        this.textDecoder = textDecoder;
        this.textEncoder = textEncoder;
    }

    /**
     * Lazily bind the foreign function interface and create a new matcher via the FFI.
     *
     * @param dictionary The dictionary the matcher is to be initialized with.
     * @param api The exports of the loaded WebAssembly module as a `FiveoFfi` interface.
     * @param memory The web modules RAM, so we can pass pointers to the C API.
     */
    public bind(dictionary: string[], api: FiveoFfi, memory: WebAssembly.Memory) {
        if (this.matcherPtr !== NullPointer) {
            throw new Error("Already initialized a matcher on this binding.");
        }

        this.api = api;
        this.memory = memory;
        this.dictionary = dictionary;

        const dictionaryString = dictionary.join("\n");
        const dictionaryBuffer = this.textEncoder.encode(dictionaryString);
        const dictionaryBufferLen = dictionaryBuffer.byteLength;
        const dictionaryPtr = this.api.alloc(dictionaryBufferLen);
        const dictionaryPtrBuffer = new Uint8Array(this.memory.buffer, dictionaryPtr, dictionaryBufferLen);

        dictionaryPtrBuffer.set(dictionaryBuffer, 0);

        const matcherPtr = this.api.fiveo_matcher_create(dictionaryPtr, dictionaryBufferLen);
        if (matcherPtr === NullPointer) {
            throw new Error("Unable to create matcher");
        }

        this.matcherPtr = matcherPtr;
        return this;
    }

    /**
     * Allocate a new block of memory for this query and perform the search, returning
     * any results from the {@link #resultMap} that were inserted by the FFI callback.
     *
     * @param query The query string to match dictionary entries against.
     * @param maxResults The maximum number of results that should be returned.
     */
    public search(query: string, maxResults: number) {
        const moduleBuffer = new Uint8Array(this.memory.buffer);
        const queryToken = 0;
        const queryBuffer = this.textEncoder.encode(query);
        const queryPtr = this.api.alloc(queryBuffer.byteLength);

        if (queryPtr === NullPointer) {
            throw new Error("Unable to allocate memory for query string");
        }

        moduleBuffer.set(queryBuffer, queryPtr);

        this.resultBuffer.delete(queryToken);
        this.resultBuffer[queryToken] = new Array<Match>();

        const result = this.api.fiveo_matcher_search(
            this.matcherPtr,
            queryToken,
            queryPtr,
            query.length,
            maxResults,
        );

        this.api.dealloc(queryPtr);

        if (result === FiveoSuccess) {
            return this.resultBuffer[queryToken];
        } else {
            throw new Error(`Search was unsuccessful: ${result}`);
        }
    }

    /**
     * Create a copy of the {@code handleResult} function and bind it to this instance so it can be passed via FFI.
     */
    public createHandlerCallback() {
        return this.handleResult.bind(this);
    }

    /**
     * Global FFI callback for `lib.rs` to invoke whenever fiveo encounters a match result.
     *
     * @param {string} token The unique search token assigned to a batch of results.
     * @param {string} encoded The UTF-8 encoded string value of the match.
     * @param {number} score The score of the match.
     */
    private handleResult(token: number, entryIndex: number, score: number) {
        this.resultBuffer[token].push({
            score,
            text: this.dictionary[entryIndex],
        });
    }
}
