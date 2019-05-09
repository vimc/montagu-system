import {AuthActionsTypes, AuthTypeKeys} from "../actionTypes/AuthTypes";
import {inflate} from "pako";

export interface AuthState {
    receivedBearerToken: boolean;
    receivedCookies: boolean;
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
    receivedBearerToken: false,
    receivedCookies: false,
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
    receivedBearerToken: boolean,
    receivedCookies: boolean,
    bearerToken: string,
    permissions: string[],
    modellingGroups: string[]
}

export function loadAuthState(options: AuthStateOptions): AuthState
{
    return {
        receivedBearerToken: options.receivedBearerToken,
        receivedCookies: options.receivedCookies,
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

export const authReducer = (state = initialAuthState, action: AuthActionsTypes) => {
    switch (action.type) {
        case AuthTypeKeys.AUTHENTICATED:
            return {...action.data};
        case AuthTypeKeys.UNAUTHENTICATED:
            return initialAuthState;
        case AuthTypeKeys.AUTHENTICATION_ERROR:
            return {...state, errorMessage: action.error};
        case AuthTypeKeys.RECEIVED_COOKIES:
            return {...state, receivedCookies: true};
        default:
            return state;
    }
};
