import { TouchstonesAction, TouchstoneTypes } from "../actionTypes/TouchstonesTypes";
import { Touchstone } from "../../shared/models/Generated";

export interface TouchstonesState {
    touchstones: Touchstone[];
}

export const initialState: TouchstonesState = {
    touchstones: []
};

export const touchstonesReducer = (state = initialState, action: TouchstonesAction) => {
    switch (action.type) {
        case TouchstoneTypes.TOUCHSTONES_FETCHED:
            return { touchstones: action.data };
        default:
            return state;
    }
};

