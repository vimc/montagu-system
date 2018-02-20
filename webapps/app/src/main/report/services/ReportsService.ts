import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {

    stateSegment = "reports";

    getAllReports() {
        this.setOptions({cache: "reports"});
        return this.get("/reports/");
    }

    getReportVersions(reportId: string) {
        this.setOptions({cache: "versions"});
        return this.get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        this.setOptions({cache: "versionDetails"});
        return this.get(`/reports/${reportId}/versions/${versionId}/`);
    }
}
