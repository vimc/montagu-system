import {ResponsibilitySet, Touchstone, TouchstoneVersion} from "../../shared/models/Generated";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export interface AdminTouchstoneState {
    touchstones: Touchstone[]
    currentTouchstoneVersion: TouchstoneVersion
    currentResponsibilitySets: ResponsibilitySet[]
}

export const adminTouchstonesInitialState: AdminTouchstoneState = {
    touchstones: [],
    currentTouchstoneVersion: null,
    currentResponsibilitySets: []
};

export const adminTouchstoneReducer
    = (state = adminTouchstonesInitialState, action: TouchstonesAction): AdminTouchstoneState => {
    switch (action.type) {
        case TouchstoneTypes.ALL_TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data};
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION:
            return {...state, currentTouchstoneVersion: action.data};
        case TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED:
            return {...state, currentResponsibilitySets: action.data};
        default:
            return state;
    }
};
