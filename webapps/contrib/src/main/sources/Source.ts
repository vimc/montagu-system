import { settings } from '../Settings';

export class Source<TParams> {
    urlFunc: (parameters: TParams) => string;

    constructor(urlFunc: (parameters: TParams) => string) {
        this.urlFunc = urlFunc;
    }

    fetch(parameters: TParams): Promise<Response> {
        const url: string = this.urlFunc(parameters);
        return fetch(`${settings.baseUrl}${url}`);
    }
}