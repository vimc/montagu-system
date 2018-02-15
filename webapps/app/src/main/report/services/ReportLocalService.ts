import { LocalService } from "../../shared/services/LocalService";
import {settings} from "../../shared/Settings";

export class ReportLocalService extends LocalService {
    protected initOptions() {
        super.initOptions();
        this.options.baseURL = settings.reportingApiUrl();
    }
}