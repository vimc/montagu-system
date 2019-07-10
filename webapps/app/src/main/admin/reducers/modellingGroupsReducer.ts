import { ModellingGroupsAction, ModellingGroupTypes } from "../actionTypes/ModellingGroupsTypes";
import {ErrorInfo, ModellingGroup, ModellingGroupDetails, ResearchModel, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/ArrayHelpers";

export interface ModellingGroupsState {
    groups: ModellingGroup[];
    currentGroup: ModellingGroup;
    currentGroupDetails: ModellingGroupDetails;
    currentGroupMembers: User[];
    createGroupErrors: ErrorInfo[];
    showCreateGroupForm: boolean;
    models: ResearchModel[];
}

export const modellingGroupInitialState: ModellingGroupsState = {
    groups: [],
    currentGroup: null,
    currentGroupDetails: null,
    currentGroupMembers: [],
    createGroupErrors: [],
    showCreateGroupForm: false,
    models: []
};

export const modellingGroupsReducer = (state = modellingGroupInitialState, action: ModellingGroupsAction)
    : ModellingGroupsState => {
    switch (action.type) {
        case ModellingGroupTypes.MODELS_FETCHED:
            return {...state, models: action.data};
        case ModellingGroupTypes.GROUPS_FETCHED:
            return {...state, groups: isNonEmptyArray(action.data) ? action.data : [] };
        case ModellingGroupTypes.SET_CURRENT_GROUP:
            return {...state, currentGroup: action.data };
        case ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS:
            return {...state, currentGroupMembers: isNonEmptyArray(action.data) ? action.data : [] };
        case ModellingGroupTypes.GROUP_DETAILS_FETCHED:
            return {...state, currentGroupDetails: action.data ? action.data : null };
        case ModellingGroupTypes.ADD_MODELLING_GROUP:
            return {...state, groups: [...state.groups, action.data]};
        case ModellingGroupTypes.SET_SHOW_CREATE_GROUP:
            return {...state, showCreateGroupForm: action.data};
        default:
            return state;
    }
};