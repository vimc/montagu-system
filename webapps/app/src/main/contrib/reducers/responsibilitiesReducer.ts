import {ResponsibilitiesAction, ResponsibilitiesTypes} from "../actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibility, IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export interface ResponsibilitiesState {
    set: IExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;
}

export const initialState: ResponsibilitiesState = {
    set: null,
    currentResponsibility: null,
};

export const responsibilitiesReducer = (state = initialState, action: ResponsibilitiesAction) => {
    switch (action.type) {
        case ResponsibilitiesTypes.SET_RESPONSIBILITIES:
            return {...state, set: action.data };
        case ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY_SET:
            return {...state, currentResponsibility: action.data };
        default:
            return state;
    }
};

