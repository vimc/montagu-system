import { FetchHelper, FetchHelperConfig } from "../../shared/fetch/helpers";
import { mockFetcherResponse, mockResponse, promiseJSON } from "../../mocks/mockRemote";
import { Result } from "../../../main/shared/models/Generated";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import fetcher, { FetchOptions } from "../../../main/shared/sources/Fetcher";
import { SinonSpy } from "sinon";

export class ReportingFetchHelper<TPayload> extends FetchHelper<TPayload> {
    constructor(config: FetchHelperConfig<TPayload>) {
        super(config)
    }

    getFetcherSpy(): SinonSpy {
        return this.sandbox.sinon.spy(fetcher.fetcher, "fetchFromReportingApi");
    }

    mockFetcherResponse(payload: Result, errorMessage?: string) {
        mockFetcherResponse(mockResponse(), mockResponse(payload, errorMessage));
    }
}