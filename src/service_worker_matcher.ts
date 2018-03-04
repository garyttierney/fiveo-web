import Match from "./match";
import Matcher from "./matcher";

export default class ServiceWorkerMatcher implements Matcher {
    public search(query: string, limit: number): Promise<Match[]> {
        throw new Error("Method not implemented.");
    }
}
