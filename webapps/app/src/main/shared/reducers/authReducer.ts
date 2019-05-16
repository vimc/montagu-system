import {AuthActionsTypes, AuthTypeKeys} from "../actionTypes/AuthTypes";
import {helpers} from "../Helpers";

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
    isReportRunner: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false,
    isReportReviewer: false,
    isReportRunner: false
};

export interface AuthStateOptions {
    username: string,
    loggedIn: boolean,
    bearerToken: string,
    permissions: string[],
    modellingGroups: string[]
}

export function loadAuthState(options: AuthStateOptions): AuthState {
    return {
        loggedIn: options.loggedIn,
        bearerToken: options.bearerToken,
        isAccountActive: options.permissions.some((x: string) => x == "*/can-login"),
        isModeller: options.modellingGroups.length > 0,
        username: options.username,
        permissions: options.permissions,
        modellingGroups: options.modellingGroups,
        isReportReviewer: options.permissions.indexOf("*/reports.review") > -1,
        isReportRunner: options.permissions.indexOf("*/reports.run") > -1,
    }
}

export const authReducer = (state = initialAuthState, action: AuthActionsTypes): AuthState => {
    switch (action.type) {
        case AuthTypeKeys.AUTHENTICATED:
            return {...action.data};
        case AuthTypeKeys.UNAUTHENTICATED:
            helpers.redirectToMontaguLogin();
            return {...initialAuthState, loggedIn: false};
        case AuthTypeKeys.AUTHENTICATION_ERROR:
            return {...state, errorMessage: action.error, loggedIn:false};
        case AuthTypeKeys.RECEIVED_COOKIES:
            return {...state, loggedIn: true};
        default:
            return state;
    }
};
