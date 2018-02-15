import { ReportsActionsTypes, ReportTypeKeys } from "../actionTypes/ReportsTypes";
import { Report } from "../../shared/models/Generated";

export interface ReportsState {
    userGroups: Report[];
}

export const initialState: ModellingGroupsState = {
    userGroups: []
};

export const modellingGroupsReducer = (state = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case ModellingGroupTypeKeys.USER_GROUPS_FETCHED:
            return { userGroups: action.data };
        default:
            return state;
    }
};

