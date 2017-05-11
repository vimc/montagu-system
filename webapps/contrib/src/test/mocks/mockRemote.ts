import * as sinon from "sinon";
import { Source } from "../../main/sources/Source";
import { ErrorInfo, Result, ResultStatus } from "../../main/Models";
import fetcher, { FetchOptions } from "../../main/sources/Fetcher";

export function promiseJSON(data: any): Response {
    return {
        json: () => new Promise<any>(function (resolve, reject) {
            resolve(data);
        })
    } as Response;
}

export function mockSource<T>(source: Source<T>, data?: Result, errorMessage?: string) {
    data = data || {
            status: "success",
            data: {},
            errors: []
        };

    const promise = new Promise<Response>(function (resolve, reject) {
        if (errorMessage) {
            reject(errorMessage);
        } else {
            resolve(promiseJSON(data));
        }
    });
    source.fetch = sinon.stub().returns(promise);
}

export function mockResult<T>(data: T,
                              errors?: Array<ErrorInfo>,
                              status?: ResultStatus): Result {
    errors = errors || [];
    status = status || "success";

    return { data, errors, status };
}

export function mockFetcher(promise: Promise<Response>) {
    fetcher.fetch = function (urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return promise;
    };
}