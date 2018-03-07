import { createBlockingMatcher, Matcher } from "../src";
import BenchmarkSuite from "./bench_suite";

// @ts-ignore
// tslint:disable-next-line:no-var-requires
const DICTIONARY = require("./data/english_word_list.json");

class EnglishDictionaryBenchmarkSuite extends BenchmarkSuite<Matcher> {
    protected name(): string {
        return "english_word_list (310k entries)";
    }

    protected execute(arg: Matcher): Promise<any> {
        return arg.search("witcher", 50);
    }

    protected setup(): Promise<Matcher> {
        return createBlockingMatcher(DICTIONARY);
    }
}

const benchmark = new EnglishDictionaryBenchmarkSuite();
// @ts-ignore
// tslint:disable-next-line:no-console
benchmark.run().then((results: string[]) => results.forEach((result) => console.log(result)));
