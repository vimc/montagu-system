import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {

    stateSegment = "reports";

    getAllReports() {
        this.setOptions({isCached: true});
        return this.get("/reports/");
    }

    getReportVersions(reportId: string) {
        this.setOptions({isCached: true});
        return this.get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        this.setOptions({isCached: true});
        return this.get(`/reports/${reportId}/versions/${versionId}/`);
    }
}
