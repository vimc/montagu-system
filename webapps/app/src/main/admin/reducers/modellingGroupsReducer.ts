import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import {ModellingGroup, ModellingGroupDetails, User} from "../../shared/models/Generated";

export interface ModellingGroupsState {
    groups: ModellingGroup[];
    currentGroup: ModellingGroup;
    currentGroupDetails: ModellingGroupDetails;
    currentGroupMembers: User[];
}

export const modellingGroupInitialState: ModellingGroupsState = {
    groups: [],
    currentGroup: null,
    currentGroupDetails: null,
    currentGroupMembers: []
};

export const modellingGroupsReducer = (state = modellingGroupInitialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypes.ADMIN_GROUPS_FETCHED:
            return {...state, groups: action.data ? action.data : [] };
        case ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP:
            return {...state, currentGroup: action.data };
        case ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP_MEMBERS:
            return {...state, currentGroupMembers: action.data ? action.data : [] };
        case ModellingGroupTypes.ADMIN_GROUP_DETAILS_FETCHED:
            return {...state, currentGroupDetails: action.data ? action.data : null };
        default:
            return state;
    }
};
