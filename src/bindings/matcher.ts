import {FiveoFfi} from "./api";

export default class MatcherBinding {
    /**
     * A description of the memory pages available to the WebAssembly module.
     */
    private memory: WebAssembly.Memory;

    /**
     * The foreign function interface to fiveo's C API loaded as a WebAssembly module.
     */
    private api: FiveoFfi;

    /**
     * Lazily bind the foreign function interface.  Required so link the bindings callback function.
     *
     * @param api The exports of the loaded WebAssembly module as a `FiveoFfi` interface.
     * @param memory The web modules RAM, so we can pass pointers to the C API.
     */
    bind(api: FiveoFfi, memory: WebAssembly.Memory) {
        this.api = api;
        this.memory = memory;

        return this;
    }

    handleSearchResult(token: string, value: string, score: number) {
        console.log({token, value, score});
    }
}