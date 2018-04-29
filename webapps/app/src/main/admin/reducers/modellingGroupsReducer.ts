import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import {ModellingGroup, ModellingGroupDetails} from "../../shared/models/Generated";

export interface ModellingGroupsState {
    groups: ModellingGroup[];
    currentGroup: ModellingGroup;
    currentGroupDetails: ModellingGroupDetails;
}

export const modellingGroupInitialState: ModellingGroupsState = {
    groups: [],
    currentGroup: null,
    currentGroupDetails: null
};

export const modellingGroupsReducer = (state = modellingGroupInitialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypes.ADMIN_GROUPS_FETCHED:
            return {...state, groups: action.data ? action.data : [] };
        case ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP:
            return {...state, currentGroup: action.data };
        case ModellingGroupTypes.ADMIN_GROUP_DETAILS_FETCHED:
            return {...state, currentGroupDetails: action.data };
        default:
            return state;
    }
};
