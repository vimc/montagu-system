import { Fetcher } from "../../shared/sources/Fetcher";
import {settings} from "../../shared/Settings";
import {FetchOptions} from "../../shared/sources/Fetcher";
import { localStorageHandler } from "../../shared/services/localStorageHandler";

export class ReportingFetcher extends Fetcher {

    getBearerToken(): string {
        // TODO: after making this redux, will be loaded from state
        return localStorageHandler.get("accessToken");
    }

    buildReportingURL(urlFragment: string): string {
        if (urlFragment.startsWith("/v1")) {
            urlFragment = urlFragment.substring("/v1".length);
        }
        return settings.reportingApiUrl() + urlFragment;
    }

    static buildRelativeReportingURL(urlFragment: string): string {
        return "/v1" + urlFragment;
    }

    fetchFromReportingApi(urlFragment: string, options?: FetchOptions, includeToken: boolean = true): Promise<Response> {
        const url = this.buildReportingURL(urlFragment);
        console.log(`Fetching from ${url}`);
        options = options || {};
        options.headers = options.headers || {};
        if (includeToken) {
            options.headers["Authorization"] = `Bearer ${this.getBearerToken()}`;
        }
        return fetch(url, options);
    }

}
