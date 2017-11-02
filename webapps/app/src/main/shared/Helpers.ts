export function doNothing() {

}

export function encodeFilename(filename: string) {
    return filename.replace("/", ":");
}

export function queryStringAsObject(url: string = window.location.href): any {
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
}

export function longTimestamp(date: Date) {
    return `${longDate(date)}, ${date.getHours()}:${date.getMinutes()}`;
}

// We use this format as it is unambiguous between USA and UK
export function longDate(date: Date) {
    return date.toDateString();
}