import {
    ReportPublished,
    ReportsActionsTypes, ReportsFilterFields, ReportsFilterPublishTypes, ReportsSortingFields,
    ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {Report} from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";

export interface ReportsState {
    reports: Report[];
    reportsSortBy: ReportsSortingFields;
    reportsFilter: ReportsFilterFields;
    versions: string[];
    currentReport: string;
    versionDetails: Version;
}

export const reportsInitialState: ReportsState = {
    reports: null,
    reportsSortBy: ReportsSortingFields.name,
    reportsFilter: {
        published: ReportsFilterPublishTypes.all,
        timeFrom: undefined,
        timeUntil: undefined
    },
    versions: null,
    currentReport: null,
    versionDetails: null
};

export const reportsReducer = (state = reportsInitialState, action: ReportsActionsTypes) : ReportsState => {
    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return { ...state, reports: action.data };
        case ReportTypeKeys.SORT_REPORTS:
            return { ...state, reportsSortBy: action.data};
        case ReportTypeKeys.FILTER_REPORTS:
            return { ...state, reportsFilter: Object.assign({}, state.reportsFilter, action.data)};
        case ReportTypeKeys.REPORT_VERSIONS_FETCHED:
            return {...state, versions: action.data};
        case ReportTypeKeys.SET_CURRENT_REPORT:
            return { ...state, currentReport: action.data };
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
