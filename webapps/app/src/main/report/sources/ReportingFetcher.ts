import { Fetcher } from "../../shared/sources/Fetcher";
import { reportingAuthStore } from "../stores/ReportingAuthStore";
import {settings} from "../../shared/Settings";
import {FetchOptions} from "../../shared/sources/Fetcher";

export class ReportingFetcher extends Fetcher {

    getBearerToken(): string {
        return reportingAuthStore.getState().bearerToken;
    }

    buildURL(urlFragment: string): string {
        return settings.reportingApiUrl() + urlFragment;
    }

}
