import { TouchstonesAction, TouchstoneTypes } from "../actionTypes/TouchstonesTypes";
import { Touchstone } from "../../shared/models/Generated";

export interface TouchstonesState {
    touchstones: Touchstone[];
    currentTouchstone: Touchstone;
}

export const initialState: TouchstonesState = {
    touchstones: [],
    currentTouchstone: null
};

export const touchstonesReducer = (state = initialState, action: TouchstonesAction) => {
    switch (action.type) {
        case TouchstoneTypes.TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data };
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE:
            return {...state, currentTouchstone: action.data };
        default:
            return state;
    }
};

