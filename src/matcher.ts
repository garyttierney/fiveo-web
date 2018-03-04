import Match from "./match";

/**
 * Specification for an approximate string matcher algorithm with a dictionary of match candidates.
 */
export default interface Matcher {
    /**
     *
     * @param query A query-string to return approximate matches for.
     * @property limit The maximum number of {@link Match}es that should be returned.
     */
    search(query: string, limit: number): Promise<Match[]>;
}
