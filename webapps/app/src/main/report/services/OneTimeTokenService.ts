import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class OneTimeTokenService extends AbstractLocalService {

    fetchToken(urlToFetchFor: string) {
        const url = "/onetime_token/?url=" + encodeURI(urlToFetchFor);
        return this.get(url);
    }
}