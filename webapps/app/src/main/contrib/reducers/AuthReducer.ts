import { ActionsTypes, TypeKeys } from "../../shared/actionTypes/AuthTypes";

import { contribAuthActions } from "../actions/ContribAuthActions";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: any;
}

const initialState: AuthState = {
    bearerToken: null,
    loggedIn: false,
    username: null,
    permissions: []
};

export const authReducer = (state = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case TypeKeys.AUTHENTICATED:
            action.dispatchAfter(contribAuthActions.afterAuth())
            return { ...action.data };
        case TypeKeys.UNAUTHENTICATED:
            return {  };
        case TypeKeys.AUTHENTICATION_ERROR:
            return { ...state, errorMessage: action.error };
        default:
            return state;
    }
};

