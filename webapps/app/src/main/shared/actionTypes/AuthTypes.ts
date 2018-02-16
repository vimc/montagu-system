import { AuthState } from "../reducers/authReducer";

export enum AuthTypeKeys {
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
}

export interface Authenticated {
    type: AuthTypeKeys.AUTHENTICATED;
    data: AuthState;
}

export interface AuthenticationError {
    type: AuthTypeKeys.AUTHENTICATION_ERROR;
    error: string;
}
export interface Unauthenticated {
    type: AuthTypeKeys.UNAUTHENTICATED;
}

export type AuthActionsTypes =
    | Authenticated
    | AuthenticationError
    | Unauthenticated;