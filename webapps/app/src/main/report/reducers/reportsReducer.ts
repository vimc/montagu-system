import {
    ReportPublished,
    ReportsActionsTypes,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Report} from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";

export interface ReportsState {
    reports: Report[];
    versions: string[];
    currentReport: string;
    currentVersion: string;
    versionDetails: Version;
}

export const reportsInitialState: ReportsState = {
    reports: [],
    versions: [],
    currentReport: null,
    currentVersion: null,
    versionDetails: null
};

export const reportsReducer = (state = reportsInitialState, action: ReportsActionsTypes) => {
    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return {...state, reports: action.data};
        case ReportTypeKeys.REPORT_VERSIONS_FETCHED:
            return {...state, versions: action.data};
        case ReportTypeKeys.SET_CURRENT_REPORT:
            return {...state, currentReport: action.data};
        case ReportTypeKeys.SET_CURRENT_VERSION:
            return {...state, currentVersion: action.data};
        case ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED:
            return {...state, versionDetails: action.data};
        case ReportTypeKeys.REPORT_PUBLISHED:
            let report = (action as ReportPublished).data;
            // TODO actually update report status
            return {...state};
        case ReportTypeKeys.REPORT_UNPUBLISHED:
            report = (action as ReportUnpublished).data;
            // TODO actually update report status
            return {...state};
        default:
            return state;
    }
};

