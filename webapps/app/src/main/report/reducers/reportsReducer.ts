import { ReportsActionsTypes, ReportTypeKeys } from "../actionTypes/ReportsTypes";
import { Report } from "../../shared/models/Generated";

export interface ReportsState {
    reports: Report[];
}

export const initialState: ReportsState = {
    reports: []
};

export const reportsReducer = (state = initialState, action: ReportsActionsTypes) => {
    switch (action.type) {
        case ReportTypeKeys.REPORTS_FETCHED:
            return { reports: action.data };
        default:
            return state;
    }
};

