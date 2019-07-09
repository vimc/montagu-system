import {AbstractLocalService, buildRelativeURL} from "./AbstractLocalService";

export class OneTimeTokenService extends AbstractLocalService {

    fetchToken(urlToFetchFor: string) {
        urlToFetchFor = buildRelativeURL(urlToFetchFor);
        const url = "/onetime_token/?url=" + encodeURIComponent(urlToFetchFor);
        return this.get(url);
    }
}