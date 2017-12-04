import {jwtDecoder} from "./sources/JwtDecoder";
import {Result} from "./models/Generated";

export function doNothing() {

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

        const removeQueryString = () => {
            history.replaceState({}, document.title, location.href.split("?")[0]);
        };

        if (!queryAsObject.result) {
            return null
        }

        try {
            const decoded = jwtDecoder.jwtDecode(queryAsObject.result);
            removeQueryString();
            return JSON.parse(decoded.result);
        }
        catch (e) {
            // if the query string token is nonsense, just return null
            removeQueryString();
            return null;
        }
    }
};