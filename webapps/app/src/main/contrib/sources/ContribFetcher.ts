import { Fetcher } from "../../shared/sources/Fetcher";
import { contribAuthStore } from "../stores/ContribAuthStore";

export class ContribFetcher extends Fetcher {
    getBearerToken(): string {
        return contribAuthStore.getState().bearerToken;
    }
}
