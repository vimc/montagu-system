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

export function loadAuthState(
    username: string,
    receivedBearerToken: boolean,
    receivedCookies: boolean,
    bearerToken: string,
    permissions: string[],
    modellingGroups: string[]): AuthState
{
    return {
        receivedBearerToken: receivedBearerToken,
        receivedCookies: receivedCookies,
        bearerToken: bearerToken,
        isAccountActive: permissions.some((x: string) => x == "*/can-login"),
        isModeller: modellingGroups.length > 0,
        username: username,
        permissions: permissions,
        modellingGroups: modellingGroups,
        isReportReviewer: permissions.indexOf("*/reports.review") > -1,
        isReportRunner: permissions.indexOf("*/reports.run") > -1,
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
