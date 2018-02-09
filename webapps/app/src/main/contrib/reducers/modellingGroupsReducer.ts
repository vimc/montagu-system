import { ActionsTypes, TypeKeys } from "../actionTypes/ModellingGroupsTypes";
import { ModellingGroup } from "../../shared/models/Generated";

export interface ModellingGroupsState {
    items: ModellingGroup[];
}

const initialState: ModellingGroupsState = {
    items: []
};

export const modellingGroupsReducer = (state = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case TypeKeys.GROUPS_FETCHED:
            return { items: action.data };
        default:
            return state;
    }
};

