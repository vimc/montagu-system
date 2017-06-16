import { settings } from "../Settings";
import { contribAuthStore } from "../../contrib/stores/ContribAuthStore";

export interface FetchOptions {
    method?: string,
    body?: any,
    headers?: any,
    credentials?: "omit" | "same-origin" | "include"
}

class Fetcher {
    buildURL(urlFragment: string): string {
        return settings.apiUrl() + urlFragment;
    }

    fetch(urlFragment: string, options?: FetchOptions, includeToken: boolean = true): Promise<Response> {
        const url = this.buildURL(urlFragment);
        console.log(`Fetching from ${url}`);
        options = options || {};
        options.headers = options.headers || {};
        if (includeToken) {
            options.headers["Authorization"] = `Bearer ${contribAuthStore.getState().bearerToken}`;
        }
        return fetch(url, options);
    }
}

const fetcher = new Fetcher();

export default fetcher;