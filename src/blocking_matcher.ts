import MatcherBinding from "./bindings/matcher_binding";
import Match from "./match";
import Matcher from "./matcher";

export default class BlockingMatcher implements Matcher {
    private bindings: MatcherBinding;

    constructor(bindings: MatcherBinding) {
        this.bindings = bindings;
    }

    public search(query: string, limit: number): Promise<Match[]> {
        return Promise.resolve(this.bindings.search(query, limit));
    }
}
