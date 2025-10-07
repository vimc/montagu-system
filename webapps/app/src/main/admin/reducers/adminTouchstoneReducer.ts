import {
    ErrorInfo,
    ResponsibilitySetWithComments,
    ResponsibilitySetWithExpectations,
    Touchstone,
    TouchstoneVersion
} from "../../shared/models/APITypes";
import {TouchstonesAction, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";
import {AnnotatedResponsibility, AnnotatedResponsibilitySet} from "../models/AnnotatedResponsibility";

export interface AdminTouchstoneState {
    touchstones: Touchstone[];
    currentTouchstone: Touchstone;
    currentTouchstoneVersion: TouchstoneVersion;
    currentResponsibilitySets: ResponsibilitySetWithExpectations[];
    currentResponsibilityComments: ResponsibilitySetWithComments[];
    currentResponsibility: AnnotatedResponsibility;
    currentResponsibilitySet: AnnotatedResponsibilitySet;
    createTouchstoneErrors: ErrorInfo[]
}

export const adminTouchstonesInitialState: AdminTouchstoneState = {
    touchstones: [],
    currentTouchstone: null,
    currentTouchstoneVersion: null,
    currentResponsibilitySets: [],
    currentResponsibilityComments: [],
    currentResponsibility: null,
    currentResponsibilitySet: null,
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
        case TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED:
            return {...state, currentResponsibilityComments: action.data};
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY:
            return {...state, currentResponsibility: action.data};
        case TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET:
            return {...state, currentResponsibilitySet: action.data};
        case TouchstoneTypes.NEW_TOUCHSTONE_CREATED:
            return {...state, touchstones: [...state.touchstones, action.data]};
        case TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR:
            return {...state, createTouchstoneErrors: action.data};
        default:
            return state;
    }
};
