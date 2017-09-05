import { settings } from "../Settings";
import { isUndefined } from "util";

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
    buildOneTimeLink(token: string): string {
        return this.buildURL(`/onetime_link/${token}/`);
    }

    fetch(urlFragment: string, options?: FetchOptions, includeToken: boolean = true): Promise<Response> {
        const url = this.buildURL(urlFragment);

        let methodText = "";
        if (options && options.method) {
            methodText = ` (method: ${options.method})`;
        }
        console.log(`Fetching from ${url}${methodText}`);

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