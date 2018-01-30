import { Fetcher } from "../../shared/sources/Fetcher";
// import { contribAuthStore } from "../stores/ContribAuthStore";

export class ContribFetcher extends Fetcher {
    getBearerToken(): string {
        // TODO: after making this redux, will be loaded from state
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem("accessToken");
        }
    }
}
