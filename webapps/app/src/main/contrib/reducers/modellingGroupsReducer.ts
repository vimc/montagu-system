import { ActionsTypes, ModellingGroupTypeKeys } from "../actionTypes/ModellingGroupsTypes";
import { ModellingGroup } from "../../shared/models/Generated";

export interface ModellingGroupsState {
    items: ModellingGroup[];
}

export const initialState: ModellingGroupsState = {
    items: []
};

export const modellingGroupsReducer = (state = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case ModellingGroupTypeKeys.GROUPS_FETCHED:
            return { items: action.data };
        default:
            return state;
    }
};

