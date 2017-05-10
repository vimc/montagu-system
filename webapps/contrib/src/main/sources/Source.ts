import fetcher from "./Fetcher";

export class Source<TParams> {
    urlFunc: (parameters: TParams) => string;

    constructor(urlFunc: (parameters: TParams) => string) {
        this.urlFunc = urlFunc;
    }

    fetch(parameters: TParams): Promise<Response> {
        const urlFragment = this.urlFunc(parameters);
        return fetcher.fetch(urlFragment);
    }
}