import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {
    getAllReports() {
        return this.get("/reports/");
    }

    publishReport(name: string, version: string) {
        return this.get(`/reports/${name}/versions/${version}/publish/`);
    }

    unPublishReport(name: string, version: string) {
        return this.get(`/reports/${name}/versions/${version}/publish/?value=false`);
    }
}
