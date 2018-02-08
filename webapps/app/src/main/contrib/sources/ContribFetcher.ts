import { Fetcher } from "../../shared/sources/Fetcher";
import { localStorageHandler } from "../../shared/services/localStorageHandler";

export class ContribFetcher extends Fetcher {
    getBearerToken(): string {
        // TODO: after making this redux, will be loaded from state
        return localStorageHandler.get("accessToken");
    }
}
