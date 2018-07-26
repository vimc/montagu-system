import {APIService} from "../models/APIService";
import {AbstractLocalService, buildRelativeURL} from "./AbstractLocalService";

export class OneTimeTokenService extends AbstractLocalService {

    fetchToken(urlToFetchFor: string, service: APIService) {
        urlToFetchFor = buildRelativeURL(urlToFetchFor);
        const url = "/onetime_token/?url=" + encodeURI(urlToFetchFor);
        return this.get(url, service);
    }
}