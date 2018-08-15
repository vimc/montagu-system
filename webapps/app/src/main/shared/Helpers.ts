import {jwtDecoder} from "./sources/JwtDecoder";
import {Result} from "./models/Generated";
import {settings} from "./Settings";
import * as url from "url";
import * as querystring from "querystring";

export function doNothing() {

}

export function titleCase(str: string) {
    if (!str) {
        return str;
    }

    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export function encodeFilename(filename: string) {
    const forwardSlashRegex = new RegExp("/", "g");
    return filename.replace(forwardSlashRegex, ":");
}

export function longTimestamp(date: Date) {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${longDate(date)}, ${hours}:${minutes}`;
}

export function longestTimestamp(date: Date) {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${longDate(date)}, ${hours}:${minutes}:${seconds}`;
}

// We use this format as it is unambiguous between USA and UK
export function longDate(date: Date) {
    return date.toDateString();
}

export function padZero(number: number) {
    // This always sticks a zero on the front and then takes the last two digits
    return ('0' + number).slice(-2);
}

export const helpers = {
    queryStringAsObject(): any {
        const obj = {} as any;
        location.search.substr(1).split("&").forEach(item => {
            const parts = item.split("=");
            const key = parts[0];
            let value = parts[1];
            // decodeURIComponent(undefined) returns string "undefined".
            // `value &&` ensures that decodeURIComponent() is not called on undefined values
            value = value && decodeURIComponent(value);
            obj[key] = value;
        });
        return obj;
    },
    ingestQueryStringAndReturnResult<TModel>(): Result | void {

        const queryAsObject = this.queryStringAsObject();


        if (!queryAsObject.result) {
            return null
        }

        try {
            const decoded = jwtDecoder.jwtDecode(queryAsObject.result);
            helpers.removeQueryString();
            return JSON.parse(decoded.result);
        }
        catch (e) {
            // if the query string token is nonsense, just return null
            helpers.removeQueryString();
            return null;
        }
    },
    removeQueryString() {
        history.replaceState({}, document.title, helpers.urlWithoutQueryString(location.href));
    },
    urlWithoutQueryString(uri: string): string {
        const parsed = url.parse(uri, true);
        parsed.query = null;
        // we need to rebuild `search` now as it gets used by `format` under the hood
        parsed.search = querystring.stringify(parsed.query);
        return url.format(parsed);
    },
    getCurrentLocation(): string {
        return window.location.href;
    }
};