import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {settings} from "../../shared/Settings";

export abstract class AbstractReportLocalService extends AbstractLocalService {
    protected initOptions() {
        super.initOptions();
        this.options.baseURL = settings.reportingApiUrl();
    }
}

export function buildRelativeReportingURL(urlFragment: string): string {
    return "/v1" + urlFragment;
}

export function buildReportingURL(urlFragment: string): string {
    if (urlFragment.startsWith("/v1")) {
        urlFragment = urlFragment.substring("/v1".length);
    }
    return settings.reportingApiUrl() + urlFragment;
}