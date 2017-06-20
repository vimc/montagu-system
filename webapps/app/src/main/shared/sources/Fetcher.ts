import { settings } from "../Settings";

export interface FetchOptions {
    method?: string,
    body?: any,
    headers?: any,
    credentials?: "omit" | "same-origin" | "include"
}

export abstract class Fetcher {
    abstract getBearerToken(): string;

    buildURL(urlFragment: string): string {
        return settings.apiUrl() + urlFragment;
    }

    fetch(urlFragment: string, options?: FetchOptions, includeToken: boolean = true): Promise<Response> {
        const url = this.buildURL(urlFragment);
        console.log(`Fetching from ${url}`);
        options = options || {};
        options.headers = options.headers || {};
        if (includeToken) {
            options.headers["Authorization"] = `Bearer ${this.getBearerToken()}`;
        }
        return fetch(url, options);
    }
}

export default {
    fetcher: null
};