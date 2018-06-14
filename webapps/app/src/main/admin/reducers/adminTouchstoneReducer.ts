import {Touchstone} from "../../shared/models/Generated";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export interface TouchstoneState {
    touchstones: Touchstone[]
}

export const touchstonesInitialState: TouchstoneState = {
    touchstones: []
};

export const adminTouchstoneReducer = (state = touchstonesInitialState, action: TouchstonesAction) => {
    switch (action.type) {
        case TouchstoneTypes.ALL_TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data};
        default:
            return state;
    }
};
