import {ResponsibilitiesAction, ResponsibilitiesTypes} from "../actionTypes/ResponsibilitiesTypes";
import { IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export interface ResponsibilitiesState {
    set: IExtendedResponsibilitySet;
}

export const initialState: ResponsibilitiesState = {
    set: null,
};

export const responsibilitiesReducer = (state = initialState, action: ResponsibilitiesAction) => {
    switch (action.type) {

        case ResponsibilitiesTypes.SET_RESPONSIBILITIES:
            return {...state, set: action.data };
        default:
            return state;
    }
};

