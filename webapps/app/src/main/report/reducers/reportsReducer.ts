import {ReportPublished, ReportsActionsTypes, ReportTypeKeys, ReportUnpublished} from "../actionTypes/ReportsTypes";
import {Report} from "../../shared/models/Generated";

export interface ReportsState {
    reports: Report[];
}

export const reportsInitialState: ReportsState = {
    reports: []
};

export const reportsReducer = (state = reportsInitialState, action: ReportsActionsTypes) => {
    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return {reports: action.data};
        case ReportTypeKeys.REPORT_PUBLISHED:
            let data = (action as ReportPublished).data;
            // TODO once versions in store, update published version
            return {reports: state.reports};
        case ReportTypeKeys.REPORT_UNPUBLISHED:
            data = (action as ReportUnpublished).data;
            // TODO once versions in store, update published version
            return {reports: state.reports};
        default:
            return state;
    }
};

