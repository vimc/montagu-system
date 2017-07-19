import SourceModel = AltJS.SourceModel;
import { reportActions } from "../actions/ReportActions";
import {ReportStoreState} from "../stores/ReportStore";
import {ReportingSource} from "./ReportingSource";

export class ReportSource extends ReportingSource<ReportStoreState> {

    fetchReports: () => SourceModel<string[]>;

    constructor() {
        super();
        this.fetchReports = () => this.doFetch(() => "/reports/", {
            loading: reportActions.beginFetchReports,
            success: reportActions.updateReports,
            isCached: s => s.reports && s.reports.length > 0
        });
    }
}
