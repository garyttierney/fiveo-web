import MatcherBindingFactory from './bindings/factory';
import MatcherBinding from './bindings/matcher';

export default class Matcher {
    static async createDefaultMatcher(text: string) {
        return MatcherBindingFactory.create(text)
            .then(binding => new Matcher(binding));
    }

    /**
     * The bindings to the C API of the fuzzy search library.
     */
    private bindings: MatcherBinding;

    private constructor(bindings: MatcherBinding) {
        this.bindings = bindings;
    }

    search(query: string) {
        //@todo
    }
}

window.onload = async () => {
    const matcher = await Matcher.createDefaultMatcher("abc\ndef\nword1\n");
    const query = matcher.search("test");
};