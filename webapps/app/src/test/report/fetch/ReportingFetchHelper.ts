import { FetchTestConfig, FetchHelperConfig, FetchHelper } from "../../shared/fetch/helpers";
import { expect } from "chai";
import {expectNoActions, getActions} from "../../actionHelpers";
import {mockResult, promiseJSON} from "../../mocks/mockRemote";
import {Sandbox} from "../../Sandbox";
import {ErrorInfo, Result } from "../../../main/shared/models/Generated";
import { Notification } from "../../../main/shared/actions/NotificationActions";
import {ReportingFetcher} from "../../../main/report/sources/ReportingFetcher";
import fetcher, { FetchOptions } from "../../../main/shared/sources/Fetcher";
import { SinonSpy } from "sinon";

function mockFetcherResponse<T>(data?: Result, errorMessage?: string) {
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
}