import fetcher, {FetchOptions} from "../../main/shared/sources/Fetcher";
import {mockResponse} from "./mockRemote";
import {Result} from "../../main/shared/models/Generated";

export enum APIType {
    Montagu,
    Reporting
}

export interface FakeEndpoint {
    urlFragment: RegExp;
    result: Result;
    api?: APIType
}

function createFetchHandler(api: APIType, responses: FakeEndpoint[]) {
    return function (urlFragment: string, options?: FetchOptions, includeToken: boolean = true) {
        const response = responses.find(r => {
            const match = urlFragment.match(r.urlFragment);
            const endpointAPI = r.api || APIType.Montagu;
            return match && match.length > 0 && endpointAPI == api;
        });
        if (response) {
            console.log(`Returned fake response for ${urlFragment} (${api})`);//: ${JSON.stringify(response.result.data)}`);
            return mockResponse(response.result);
        } else {
            return mockResponse(null, `Unsupported URL for mock fetcher: ${urlFragment} (${api})`);
        }
    };
}