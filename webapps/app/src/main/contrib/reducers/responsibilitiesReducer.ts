import {ResponsibilitiesAction, ResponsibilitiesTypes} from "../actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibility, IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export interface ResponsibilitiesState {
    responsibilitiesSet: IExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;
}

export const responsibilitiesInitialState: ResponsibilitiesState = {
    responsibilitiesSet: null,
    currentResponsibility: null,
};

export const responsibilitiesReducer = (state = responsibilitiesInitialState, action: ResponsibilitiesAction) => {
    switch (action.type) {
        case ResponsibilitiesTypes.SET_RESPONSIBILITIES:
            return {...state, responsibilitiesSet: action.data };
        case ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY:
            return {...state, currentResponsibility: action.data };
        default:
            return state;
    }
};

