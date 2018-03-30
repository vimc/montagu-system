import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import { ModellingGroup } from "../../shared/models/Generated";

export interface ModellingGroupsState {
    userGroups: ModellingGroup[];
}

export const initialState: ModellingGroupsState = {
    userGroups: []
};

export const modellingGroupsReducer = (state = initialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypes.USER_GROUPS_FETCHED:
            return { userGroups: action.data };
        default:
            return state;
    }
};

