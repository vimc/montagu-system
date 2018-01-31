import { AuthState } from "../reducers/AuthReducer";

export enum TypeKeys {
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    DO_AUTH_TO_API = "DO_AUTH_TO_API",
    DO_AUTH_TO_SHINY_API = "DO_AUTH_TO_SHINY_API",
    DO_UNAUTH_FROM_SHINY_API = "DO_UNAUTH_FROM_SHINY_API"
}

export interface Authenticated {
    type: TypeKeys.AUTHENTICATED;
    data: AuthState;
    dispatchAfter?: any;
}
export interface AuthenticationError {
    type: TypeKeys.AUTHENTICATION_ERROR;
    error: string;
}
export interface Unauthenticated {
    type: TypeKeys.UNAUTHENTICATED;
}

export type ActionsTypes =
    | Authenticated
    | AuthenticationError
    | Unauthenticated;