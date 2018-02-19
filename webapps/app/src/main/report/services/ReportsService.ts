import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {

    stateSegment = "reports";

    getAllReports() {
        this.setCached(this.getState().reports.length, this.getState().reports);
        return this.get("/reports/");
    }

    getReportVersions(reportId: string) {
        return this.get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        return this.get(`/reports/${reportId}/versions/${versionId}/`);
    }
}
