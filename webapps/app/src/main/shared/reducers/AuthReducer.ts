import { ActionsTypes, TypeKeys } from "../actionTypes/AuthTypes";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: any;
    isAccountActive: boolean;
    isModeller: boolean;
}

const initialState: AuthState = {
    bearerToken: null,
    loggedIn: false,
    username: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false
};

export const authReducer = (state = initialState, action: ActionsTypes) => {
    switch (action.type) {
        case TypeKeys.AUTHENTICATED:
            return { ...action.data };
        case TypeKeys.UNAUTHENTICATED:
            return {  };
        case TypeKeys.AUTHENTICATION_ERROR:
            return { ...state, errorMessage: action.error };
        default:
            return state;
    }
};
