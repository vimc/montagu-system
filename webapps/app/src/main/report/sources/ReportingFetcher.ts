import { Fetcher } from "../../shared/sources/Fetcher";
import { reportingAuthStore } from "../stores/ReportingAuthStore";
import {settings} from "../../shared/Settings";
import {FetchOptions} from "../../shared/sources/Fetcher";

export class ReportingFetcher extends Fetcher {

    getBearerToken(): string {
        return reportingAuthStore.getState().bearerToken;
    }

    buildReportingURL(urlFragment: string): string {
        return settings.reportingApiUrl() + urlFragment;
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
