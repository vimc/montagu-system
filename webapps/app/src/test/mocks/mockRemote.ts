import { ErrorInfo, Result, ResultStatus } from "../../main/shared/models/Generated";
import fetcher, { FetchOptions } from "../../main/shared/sources/Fetcher";
import { ReportingFetcher } from "../../main/report/sources/ReportingFetcher";

export function promiseJSON(data: any): Response {
    return {
        json: () => new Promise<any>(function (resolve, reject) {
            resolve(data);
        })
    } as Response;
}


export function rejectedPromiseJSON(data: any): Response {
    return {
        json: () => new Promise<any>(function (resolve, reject) {
            reject(data);
        })
    } as Response;
}

export function successResult(data: any): Result {
    return {
        status: "success",
        data: data,
        errors: []
    };
}

export function mockResponse(data?: Result, errorMessage?: string): Promise<Response> {
    data = data || successResult({});

    return new Promise<Response>(function (resolve, reject) {
        if (errorMessage) {
            reject(errorMessage);
        } else {
            resolve(promiseJSON(data));
        }
    });
}

export function mockFetcherResponse<T>(promise?: Promise<Response>, reportingPromise?: Promise<Response>) {
    mockFetcher(promise || mockResponse(), reportingPromise || mockResponse());
}

export function mockResult<T>(data: T,
                              errors?: Array<ErrorInfo>,
                              status?: ResultStatus): Result {
    errors = errors || [];
    status = status || "success";

    return { data, errors, status };
}

export function resetFetcher() {
    mockFetcherResponse();
}

export function mockFetcher(promise: Promise<Response>, reportingPromise?: Promise<Response>) {
    fetcher.fetcher = new ReportingFetcher();
    fetcher.fetcher.fetch = function(urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return promise;
    };
    fetcher.fetcher.fetchFromReportingApi = function(urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return reportingPromise || mockResponse();
    };
}

export function mockFetcherNonJson(promise: Promise<any>, reportingPromise?: Promise<any>) {
    fetcher.fetcher = new ReportingFetcher();
    fetcher.fetcher.fetch = function(urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return promise;
    };
    fetcher.fetcher.fetchFromReportingApi = function(urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return reportingPromise || mockResponse();
    };
}