import { AuthActionsTypes, AuthTypeKeys } from "../actionTypes/AuthTypes";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: string[];
    isAccountActive: boolean;
    isModeller: boolean;
    errorMessage?: string;
    isReportReviewer: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false,
    isReportReviewer: false
};

export const authReducer = (state = initialAuthState, action: AuthActionsTypes) => {
    switch (action.type) {
        case AuthTypeKeys.AUTHENTICATED:
            console.log("Uncompressed token (use jwt.io read): " + action.data.bearerToken);
            return { ...action.data };
        case AuthTypeKeys.UNAUTHENTICATED:
            return initialAuthState;
        case AuthTypeKeys.AUTHENTICATION_ERROR:
            return { ...state, errorMessage: action.error };
        default:
            return state;
    }
};
