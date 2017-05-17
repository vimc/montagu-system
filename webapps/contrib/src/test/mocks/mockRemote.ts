import { ErrorInfo, Result, ResultStatus } from "../../main/models/Generated";
import fetcher, { FetchOptions } from "../../main/sources/Fetcher";

export function promiseJSON(data: any): Response {
    return {
        json: () => new Promise<any>(function (resolve, reject) {
            resolve(data);
        })
    } as Response;
}

export function mockFetcherResponse<T>(data?: Result, errorMessage?: string) {
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
    mockFetcher(promise);
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