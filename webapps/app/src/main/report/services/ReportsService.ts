import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {
    getAllReports() {
        return this.get("/reports/");
    }

    getReportVersions(reportId: string) {
        return this.get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        return this.get(`/reports/${reportId}/versions/${versionId}/`);
    }
}
