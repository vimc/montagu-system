import {
    ReportPublished,
    ReportsAction,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Changelog, ReportVersion} from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";
import {BasicReport} from "../actionTypes/ReportsActionsTypes";

export interface ReportsState {
    reports: ReportVersion[];
    versions: string[];
    currentReport: string;
    versionDetails: Version;
    versionChangelog: Changelog[];
}

export const reportsInitialState: ReportsState = {
    reports: null,
    versions: null,
    currentReport: null,
    versionDetails: null,
    versionChangelog: null
};

export const reportsReducer = (state = reportsInitialState, action: ReportsAction) : ReportsState => {

    function getUpdatePublishedState(report: BasicReport, published: boolean) {
        const name  = report.name;
        const version = report.version;

        //Update current version if it's this one
        const versionDetails = state.versionDetails;
        if (versionDetails.name == name && versionDetails.id == version) {
            versionDetails.published = published;
        }

        //Update version in array
        const arrayVersion = state.reports.find( e => e.name == name && e.id == version);
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
        default:
            return state;
    }
};
