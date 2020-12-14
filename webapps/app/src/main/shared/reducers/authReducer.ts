import {AuthActionsTypes, AuthTypeKeys} from "../actionTypes/AuthTypes";
import {helpers} from "../Helpers";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    modellingGroups?: string[];
    isAccountActive: boolean;
    isModeller: boolean;
    errorMessage?: string;
    canDownloadCoverage: boolean;
    canUploadCoverage: boolean;
    canViewGroups: boolean;
    canViewTouchstones: boolean;
    canViewUsers: boolean;
    canReadRoles: boolean;
    canWriteRoles: boolean;
    canCreateUsers: boolean;
    canCreateModellingGroups: boolean;
    canManageGroupMembers: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    username: null,
    bearerToken: null,
    isAccountActive: false,
    isModeller: false,
    canDownloadCoverage: false,
    canUploadCoverage: false,
    canViewGroups: false,
    canViewTouchstones: false,
    canViewUsers: false,
    canReadRoles: false,
    canWriteRoles: false,
    canCreateUsers: false,
    canCreateModellingGroups: false,
    canManageGroupMembers: false
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
        modellingGroups: options.modellingGroups,

        canDownloadCoverage: permissionsInclude(options.permissions,"*/coverage.read"),
        canUploadCoverage: permissionsInclude(options.permissions, "*/coverage.write"),
        canViewGroups: permissionsInclude(options.permissions,"*/modelling-groups.read"),
        canViewTouchstones: permissionsInclude(options.permissions,"*/touchstones.read"),
        canViewUsers: permissionsInclude(options.permissions, "*/users.read"),
        canReadRoles: permissionsInclude(options.permissions,"*/roles.read"),
        canWriteRoles: permissionsInclude(options.permissions,"*/roles.write"),
        canCreateUsers: permissionsInclude(options.permissions,"*/users.create"),
        canCreateModellingGroups: permissionsInclude(options.permissions,"*/modelling-groups.write"),
        canManageGroupMembers: permissionsInclude(options.permissions,"*/modelling-groups.manage-members")
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
