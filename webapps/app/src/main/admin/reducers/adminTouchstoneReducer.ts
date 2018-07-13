import {ErrorInfo, ResponsibilitySet, Touchstone, TouchstoneVersion} from "../../shared/models/Generated";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export interface AdminTouchstoneState {
    touchstones: Touchstone[];
    currentTouchstone: Touchstone;
    currentTouchstoneVersion: TouchstoneVersion;
    currentResponsibilitySets: ResponsibilitySet[];
    createTouchstoneErrors: ErrorInfo[]
}

export const adminTouchstonesInitialState: AdminTouchstoneState = {
    touchstones: [],
    currentTouchstone: null,
    currentTouchstoneVersion: null,
    currentResponsibilitySets: [],
    createTouchstoneErrors: []
};
export const adminTouchstoneReducer
    = (state = adminTouchstonesInitialState, action: TouchstonesAction): AdminTouchstoneState => {
    switch (action.type) {
        case TouchstoneTypes.ALL_TOUCHSTONES_FETCHED:
            return {...state, touchstones: action.data};
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE:
            return {...state, currentTouchstone: action.data};
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION:
            return {...state, currentTouchstoneVersion: action.data};
        case TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED:
            return {...state, currentResponsibilitySets: action.data};
        case TouchstoneTypes.NEW_TOUCHSTONE_CREATED:
            return {...state, touchstones: [...state.touchstones, action.data]};
        case TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR:
            return {...state, createTouchstoneErrors: action.data};
        default:
            return state;
    }
};
