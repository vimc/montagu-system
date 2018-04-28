import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import { ModellingGroup } from "../../shared/models/Generated";

export interface ModellingGroupsState {
    groups: ModellingGroup[];
    // currentUserGroup: ModellingGroup;
}

export const modellingGroupInitialState: ModellingGroupsState = {
    groups: [],
    // currentUserGroup: null
};

export const modellingGroupsReducer = (state = modellingGroupInitialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypes.ADMIN_GROUPS_FETCHED:
            return {...state, groups: action.data ? action.data : [] };
        // case ModellingGroupTypes.SET_CURRENT_USER_GROUP:
        //     return {...state, currentUserGroup: action.data };
        default:
            return state;
    }
};
