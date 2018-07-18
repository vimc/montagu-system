import {AbstractReportLocalService, buildRelativeReportingURL} from "./AbstractReportLocalService";

export class OneTimeTokenService extends AbstractReportLocalService {

    fetchToken(urlToFetchFor: string) {
        urlToFetchFor = buildRelativeReportingURL(urlToFetchFor);
        const url = "/onetime_token/?url=" + encodeURI(urlToFetchFor);
        return this.get(url);
    }
}