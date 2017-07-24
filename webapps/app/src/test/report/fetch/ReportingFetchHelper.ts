import { FetchHelper, FetchHelperConfig } from "../../shared/fetch/helpers";
import { promiseJSON } from "../../mocks/mockRemote";
import { Result } from "../../../main/shared/models/Generated";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import fetcher, { FetchOptions } from "../../../main/shared/sources/Fetcher";
import { SinonSpy } from "sinon";

function mockReportingFetcherResponse<T>(data?: Result, errorMessage?: string) {
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

    mockReportingFetcher(promise);
}


function mockReportingFetcher(promise: Promise<Response>) {
    fetcher.fetcher = new ReportingFetcher();
    fetcher.fetcher.fetchFromReportingApi = function(urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        return promise;
    };
}

export class ReportingFetchHelper<TPayload> extends FetchHelper<TPayload> {
    constructor(config: FetchHelperConfig<TPayload>) {
        super(config)
    }

    getFetcherSpy(): SinonSpy {
        return this.sandbox.sinon.spy(fetcher.fetcher, "fetchFromReportingApi");
    }

    mockFetcherResponse(payload: Result, errorMessage?: string) {
        mockReportingFetcherResponse(payload, errorMessage);
    }
}