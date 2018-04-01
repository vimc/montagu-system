import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import { ModellingGroup } from "../../shared/models/Generated";

export interface ModellingGroupsState {
    userGroups: ModellingGroup[];
    currentUserGroup: ModellingGroup;
}

export const initialState: ModellingGroupsState = {
    userGroups: [],
    currentUserGroup: null
};

export const modellingGroupsReducer = (state = initialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypes.USER_GROUPS_FETCHED:
            return {...state, userGroups: action.data };
        case ModellingGroupTypes.SET_CURRENT_USER_GROUP:
            return {...state, currentUserGroup: action.data };
        default:
            return state;
    }
};

