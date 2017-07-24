import SourceModel = AltJS.SourceModel;
import { reportActions } from "../actions/ReportActions";
import {ReportStoreState} from "../stores/ReportStore";
import {ReportingSource} from "./ReportingSource";

export class ReportSource extends ReportingSource<ReportStoreState> {

    fetchReports: () => SourceModel<string[]>;
    fetchVersions: () => SourceModel<string[]>;

    constructor() {
        super();
        this.fetchReports = () => this.doFetch(() => "/reports/", {
            loading: reportActions.beginFetchReports,
            success: reportActions.updateReports,
            isCached: s => s.reports && s.reports.length > 0
        });

        this.fetchVersions = () => this.doFetch(s => `/reports/${s.currentReport}/`, {
            loading: reportActions.beginFetchVersions,
            success: reportActions.updateVersions,
            isCached: s => s.versions.hasOwnProperty(s.currentReport)
        });
    }
}
