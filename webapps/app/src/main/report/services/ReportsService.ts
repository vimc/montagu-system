import {ReportLocalService} from "./ReportLocalService";

export class ReportsService extends ReportLocalService {
    getAllReports() {
        return this.get("/reports/");
    }
}

//
// this.fetchVersions = () => this.doFetch(s => `/reports/${s.currentReport}/`, {
//
// this.fetchVersionDetails = () => this.doFetch(s => `/reports/${s.currentReport}/versions/${s.currentVersion}/`, {