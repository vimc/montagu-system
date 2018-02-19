import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {

    stateSegment = "reports";

    getAllReports() {
        this.setCached(this.getState().reports.length, this.getState().reports);
        return this.get("/reports/");
    }

    getReportVersions(reportId: string) {
        this.setCached(this.getState().versions.length, this.getState().versions);
        return this.get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        this.setCached(this.getState().versionDetails, this.getState().versionDetails);
        return this.get(`/reports/${reportId}/versions/${versionId}/`);
    }
}
