import {UserActionType, UserAction} from "../actionTypes/UserActionTypes";

export interface UserState {
    signedConfidentialityAgreement: boolean;
}

export const initialState: UserState = {
    signedConfidentialityAgreement: false
};

export const userReducer = (state = initialState, action: UserAction) => {
    switch (action.type) {
        case UserActionType.CONFIDENTIALITY_SIGNED:
            return {...state, signedConfidentialityAgreement: true};
        case UserActionType.CONFIDENTIALITY_RETRIEVED:
            return {...state, signedConfidentialityAgreement: action.data};
        default:
            return state;
    }
};

