import MatcherBinding from "./bindings/matcher_binding";
import MatcherBindingFactory from "./bindings/matcher_binding_factory";
import MatcherBindingOptions from "./bindings/matcher_binding_options";

import Match from "./match";
import Matcher from "./matcher";

import BlockingMatcher from "./blocking_matcher";
import ServiceWorkerMatcher from "./service_worker_matcher";

export {
    MatcherBindingOptions,
    Matcher,
    Match,
};

export function createBlockingMatcher(input: string[], options?: MatcherBindingOptions): Promise<Matcher> {
    return MatcherBindingFactory.create(input, options)
        .then((binding: MatcherBinding) => new BlockingMatcher(binding));
}
