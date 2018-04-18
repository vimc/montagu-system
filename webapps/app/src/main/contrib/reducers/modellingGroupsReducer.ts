import {ModellingGroupsAction, ModellingGroupTypeKeys} from "../actionTypes/ModellingGroupsTypes";
import {ModellingGroup} from "../../shared/models/Generated";

export interface ModellingGroupsState {
    userGroups: ModellingGroup[];
    signedConfidentialityAgreement: boolean;
}

export const initialState: ModellingGroupsState = {
    userGroups: [],
    signedConfidentialityAgreement: false
};

export const modellingGroupsReducer = (state = initialState, action: ModellingGroupsAction) => {
    switch (action.type) {
        case ModellingGroupTypeKeys.USER_GROUPS_FETCHED:
            return {...state, userGroups: action.data};
        case ModellingGroupTypeKeys.CONFIDENTIALITY_SIGNED:
            return {...state, signedConfidentialityAgreement: true};
        case ModellingGroupTypeKeys.CONFIDENTIALITY_RETRIEVED:
            return {...state, signedConfidentialityAgreement: action.data};
        default:
            return state;
    }
};

