import { ActionsTypes, TypeKeys } from "../actionTypes/AuthTypes";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: any;
    isAccountActive: boolean;
    isModeller: boolean;
    errorMessage?: string;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false
};

export const authReducer = (state = initialAuthState, action: ActionsTypes) => {
    switch (action.type) {
        case TypeKeys.AUTHENTICATED:
            return { ...action.data };
        case TypeKeys.UNAUTHENTICATED:
            return initialAuthState;
        case TypeKeys.AUTHENTICATION_ERROR:
            return { ...state, errorMessage: action.error };
        default:
            return state;
    }
};
