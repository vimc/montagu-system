import {AbstractReportLocalService} from "./AbstractReportLocalService";

export class ReportsService extends AbstractReportLocalService {

    getAllReports() {
        return this.setOptions({cache: ReportsCacheKeysEnum.reports})
            .get("/reports/");
    }

    getReportVersions(reportId: string) {
        return this.setOptions({cache: ReportsCacheKeysEnum.versions})
            .get(`/reports/${reportId}/`);
    }

    getVersionDetails(reportId: string, versionId: string) {
        return this.setOptions({cache: ReportsCacheKeysEnum.versionDetails})
            .get(`/reports/${reportId}/versions/${versionId}/`);
    }
}

export enum ReportsCacheKeysEnum {
    "reports" = "reports",
    "versions" = "versions",
    "versionDetails" = "versionDetails"
}