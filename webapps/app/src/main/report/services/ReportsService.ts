import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {

    getAllReports() {
        return this.setOptions({cache: 'reports'})
            .get("/reports/");
    }

    getReportVersions(reportId: string) {
        return this.setOptions({cache: 'versions'})
            .get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        return this.setOptions({cache: 'versionDetails'})
            .get(`/reports/${reportId}/versions/${versionId}/`);
    }

}
