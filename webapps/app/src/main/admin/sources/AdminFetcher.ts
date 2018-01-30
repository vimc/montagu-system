import { Fetcher } from "../../shared/sources/Fetcher";
// import { adminAuthStore } from "../stores/AdminAuthStore";

export class AdminFetcher extends Fetcher {
    getBearerToken(): string {
        // TODO: after making this redux, will be loaded from state
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem("accessToken");
        }
    }
}