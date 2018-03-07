import _ from "lodash";
import process from "process";

// @ts-ignore
// tslint:disable-next-line:no-var-requires
const BenchmarkImpl = require("benchmark").runInContext({ _, process });

export default abstract class BenchmarkSuite<ArgType> {
    public run(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            const results = new Array<any>();
            const argPromise = this.setup();

            argPromise.then((arg) => {
                const benchmark = new BenchmarkImpl({
                    defer: true,
                    fn: (deferred) => this.execute(arg).then((result) => deferred.resolve()),
                    name: this.name(),
                    onComplete: (res) => resolve(results),
                    onCycle: (event) => results.push(String(event.target)),
                    onError: (err) => reject(err),
                });

                benchmark.run();
            });
        });
    }

    protected abstract name(): string;

    protected setup(): Promise<ArgType> {
        return Promise.resolve(null);
    }

    protected abstract execute(arg?: ArgType): Promise<any>;
}
