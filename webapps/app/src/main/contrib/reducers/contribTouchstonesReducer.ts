import {Touchstone, TouchstoneVersion} from "../../shared/models/APITypes";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export interface TouchstonesState {
    touchstones: Touchstone[];
    currentTouchstoneVersion: TouchstoneVersion;
}

export const touchstonesInitialState: TouchstonesState = {
    touchstones: [],
    currentTouchstoneVersion: null
};

export const contribTouchstonesReducer = (state = touchstonesInitialState, action: TouchstonesAction): TouchstonesState => {
    switch (action.type) {
        case TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP:
            return {...state, touchstones: action.data ? action.data : [] };
        case TouchstoneTypes.ALL_TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data ? action.data : [] };
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION:
            return {...state, currentTouchstoneVersion: action.data };
        default:
            return state;
    }
};

