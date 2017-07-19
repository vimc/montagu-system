import { Fetcher } from "../../shared/sources/Fetcher";
import { reportingAuthStore } from "../stores/ReportingAuthStore";

export class ReportingFetcher extends Fetcher {
    getBearerToken(): string {
        return reportingAuthStore.getState().bearerToken;
    }
}