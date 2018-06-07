import { TouchstonesAction, TouchstoneTypes } from "../../shared/actionTypes/TouchstonesTypes";
import { Touchstone } from "../../shared/models/Generated";

export interface TouchstonesState {
    touchstones: Touchstone[];
    currentTouchstone: Touchstone;
}

export const touchstonesInitialState: TouchstonesState = {
    touchstones: [],
    currentTouchstone: null
};

export const contribTouchstonesReducer = (state = touchstonesInitialState, action: TouchstonesAction) => {
    switch (action.type) {
        case TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP:
            return {...state, touchstones: action.data ? action.data : [] };
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE:
            return {...state, currentTouchstone: action.data };
        default:
            return state;
    }
};

