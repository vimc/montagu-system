import { AuthState } from "../reducers/authReducer";

export enum TypeKeys {
    AUTHENTICATED = "AUTHENTICATED",
    UNAUTHENTICATED = "UNAUTHENTICATED",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
}

export interface Authenticated {
    type: TypeKeys.AUTHENTICATED;
    data: AuthState;
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