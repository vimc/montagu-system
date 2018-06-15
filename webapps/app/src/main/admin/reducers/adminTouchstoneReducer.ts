import {Touchstone} from "../../shared/models/Generated";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export interface AdminTouchstoneState {
    touchstones: Touchstone[]
}

export const adminTouchstonesInitialState: AdminTouchstoneState = {
    touchstones: []
};

export const adminTouchstoneReducer = (state = adminTouchstonesInitialState, action: TouchstonesAction) => {
    switch (action.type) {
        case TouchstoneTypes.ALL_TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data};
        default:
            return state;
    }
};
