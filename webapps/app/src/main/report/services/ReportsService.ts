import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {
    getAllReports() {
        return this.get("/reports/");
    }
}
