import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import {ErrorInfo, ModellingGroup, ModellingGroupDetails, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/ArrayHelpers";

export interface ModellingGroupsState {
    groups: ModellingGroup[];
    currentGroup: ModellingGroup;
    currentGroupDetails: ModellingGroupDetails;
    currentGroupMembers: User[];
    createGroupErrors: ErrorInfo[];
}

export const modellingGroupInitialState: ModellingGroupsState = {
    groups: [],
    currentGroup: null,
    currentGroupDetails: null,
    currentGroupMembers: [],
    createGroupErrors: []
};

export const modellingGroupsReducer = (state = modellingGroupInitialState, action: ModellingGroupsAction)
    : ModellingGroupsState => {
    switch (action.type) {
        case ModellingGroupTypes.GROUPS_FETCHED:
            return {...state, groups: isNonEmptyArray(action.data) ? action.data : [] };
        case ModellingGroupTypes.SET_CURRENT_GROUP:
            return {...state, currentGroup: action.data };
        case ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS:
            return {...state, currentGroupMembers: isNonEmptyArray(action.data) ? action.data : [] };
        case ModellingGroupTypes.GROUP_DETAILS_FETCHED:
            return {...state, currentGroupDetails: action.data ? action.data : null };
        case ModellingGroupTypes.ADD_MODELLING_GROUP:
            state.groups.push(action.data);
            return state;
        default:
            return state;
    }
};