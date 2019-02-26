import {
    ReportPublished,
    ReportsAction,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Changelog, ReportVersion, ReportVersionDetails} from "../../shared/models/Generated";
import {RunningReportStatus, RunningReportStatusValues} from "../models/RunningReportStatus";
import {BasicReport} from "../actionTypes/ReportsActionsTypes";

export interface ReportsState {
    reports: ReportVersion[];
    versions: string[];
    currentReport: string;
    versionDetails: ReportVersionDetails;
    versionChangelog: Changelog[];
    runningReports: RunningReportStatus[];
}

export const reportsInitialState: ReportsState = {
    reports: null,
    versions: null,
    currentReport: null,
    versionDetails: null,
    versionChangelog: null,
    runningReports: []
};

export const reportsReducer = (state = reportsInitialState, action: ReportsAction) : ReportsState => {

    function getUpdatePublishedState(report: BasicReport, published: boolean) {
        const name  = report.name;
        const version = report.version;

        //Update current version if it's this one
        const versionDetails = state.versionDetails;
        if (versionDetails && versionDetails.name == name && versionDetails.id == version) {
            versionDetails.published = published;
        }

        //Update version in array
        const arrayVersion = state.reports && state.reports.find( e => e.name == name && e.id == version);
        arrayVersion && (arrayVersion.published = published);

        return {...state, versionDetails: versionDetails, reports: state.reports};
    }

    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return { ...state, reports: action.data };
        case ReportTypeKeys.REPORT_VERSIONS_FETCHED:
            return {...state, versions: action.data};
        case ReportTypeKeys.SET_CURRENT_REPORT:
            return { ...state, currentReport: action.data };
        case ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED:
            return {...state, versionDetails: action.data};
        case ReportTypeKeys.REPORT_VERSION_CHANGELOG_RESET:
            return {...state, versionChangelog: null};
        case ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED:
            return {...state, versionChangelog: action.data};
        case ReportTypeKeys.REPORT_PUBLISHED:
            let report = (action as ReportPublished).data;
            return getUpdatePublishedState(report, true);
        case ReportTypeKeys.REPORT_UNPUBLISHED:
            report = (action as ReportUnpublished).data;
            return getUpdatePublishedState(report, false)
        case ReportTypeKeys.REPORT_RUN_STARTED:
            let runningReports = state.runningReports.filter(r => r.name != action.data.name);
            runningReports.push({
                name: action.data.name,
                key: action.data.key,
                status: RunningReportStatusValues.RUNNING_REPORT_STATUS_STARTED,
                version: null,
                output: null
            });
            return {...state, runningReports: runningReports};
        case ReportTypeKeys.REPORT_RUN_STATUS_FETCHED:
            const oldRunningReport = state.runningReports.find(r => r.key == action.data.key);
            runningReports = state.runningReports.filter(r => r.key != action.data.key);
            if (oldRunningReport) {
                const newRunningReport = {
                    name: oldRunningReport.name,
                    key: action.data.key,
                    output: action.data.output,
                    status: action.data.status,
                    version: action.data.version
                }
                runningReports.push(newRunningReport);
            }
            return {...state, runningReports: runningReports}
        case ReportTypeKeys.REPORT_RUN_STATUS_REMOVED:
            runningReports = state.runningReports.filter(r => r.name != action.data)
            return {...state, runningReports: runningReports}

        default:
            return state;
    }
};
