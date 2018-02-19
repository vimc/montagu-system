import SourceModel = AltJS.SourceModel;
import { reportActions } from "../actions/ReportActions";
import {ReportStoreState} from "../stores/ReportStore";
import {ReportingSource} from "./ReportingSource";
import {Version} from "../../shared/models/reports/Report";

export class ReportSource extends ReportingSource<ReportStoreState> {

    fetchVersions: () => SourceModel<string[]>;
    fetchVersionDetails: () => SourceModel<Version>;

    constructor() {
        super();

        this.fetchVersions = () => this.doFetch(s => `/reports/${s.currentReport}/`, {
            loading: reportActions.beginFetchVersions,
            success: reportActions.updateVersions,
            isCached: s => s.versions.hasOwnProperty(s.currentReport)
        });

        this.fetchVersionDetails = () => this.doFetch(s => `/reports/${s.currentReport}/versions/${s.currentVersion}/`, {
            loading: reportActions.beginFetchVersionDetails,
            success: reportActions.updateVersionDetails,
            isCached: s => s.versionDetails.hasOwnProperty(s.currentVersion)
        });
    }
}
