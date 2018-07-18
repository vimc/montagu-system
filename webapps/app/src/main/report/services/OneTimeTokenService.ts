import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class OneTimeTokenService extends AbstractLocalService {

    static buildRelativeReportingURL(urlFragment: string): string {
        return "/v1" + urlFragment;
    }

    fetchToken(urlToFetchFor: string) {
        urlToFetchFor = OneTimeTokenService.buildRelativeReportingURL(urlToFetchFor);
        const url = "/onetime_token/?url=" + encodeURI(urlToFetchFor);
        return this.get(url);
    }
}