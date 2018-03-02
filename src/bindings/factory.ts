import MatcherBinding from "./matcher";
import {FiveoFfi} from "./api";

// @ts-ignore
const createFfiInstance = require<any>("./ffi/lib.rs");

export default class MatcherBindingFactory {
    static async create(input: string): Promise<MatcherBinding> {
        const bindings = new MatcherBinding();

        return createFfiInstance({
            env: {
                handle_search_result: (token, value, score) => bindings.handleSearchResult(token, value, score),
                memory: new WebAssembly.Memory({initial: 10, maximum: 100}),
                table: new WebAssembly.Table({initial: 0, element: 'anyfunc'})
            }
        }).then(ffi => {
            return bindings.bind(ffi.exports as FiveoFfi, ffi.exports.memory);
        });
    }
}