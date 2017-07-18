import { Fetcher } from "../../shared/sources/Fetcher";
import { adminAuthStore } from "../stores/ReportingAuthStore";

export class AdminFetcher extends Fetcher {
    getBearerToken(): string {
        return adminAuthStore.getState().bearerToken;
    }
}