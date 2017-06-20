import { Fetcher } from "../../shared/sources/Fetcher";
import { adminAuthStore } from "../stores/AdminAuthStore";

export class AdminFetcher extends Fetcher {
    protected getBearerToken(): string {
        return adminAuthStore.getState().bearerToken;
    }
}