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

    publishReport(name: string, version: string) {
        return this.post(`/reports/${name}/versions/${version}/publish/`);
    }

    unPublishReport(name: string, version: string) {
        return this.post(`/reports/${name}/versions/${version}/publish/?value=false`);
    }
}

export enum ReportsCacheKeysEnum {
    "reports" = "reports",
    "versions" = "versions",
    "versionDetails" = "versionDetails"
}