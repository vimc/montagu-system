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
    canUploadCoverage: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    permissions: [],
    isAccountActive: false,
    isModeller: false,
    canUploadCoverage: false
};

export interface AuthStateOptions {
    username: string,
    loggedIn: boolean,
    bearerToken: string,
    permissions: string[],
    modellingGroups: string[]
}

const permissionsInclude = (permissions: string[], perm: string) => permissions.some((x: string) => x == perm);

export function loadAuthState(options: AuthStateOptions): AuthState {
    return {
        loggedIn: options.loggedIn,
        bearerToken: options.bearerToken,
        isAccountActive: permissionsInclude(options.permissions,"*/can-login"),
        isModeller: options.modellingGroups.length > 0,
        username: options.username,
        permissions: options.permissions,
        modellingGroups: options.modellingGroups,
        canUploadCoverage: permissionsInclude(options.permissions, "*/coverage.write")
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
