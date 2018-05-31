import {ErrorInfo, User} from "../../shared/models/Generated";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    ALL_USER_ROLES_FETCHED = "ALL_USER_ROLES_FETCHED",
    SHOW_CREATE_USER = "SHOW_CREATE_USER",
    SET_CREATE_USER_ERRORS = "SET_CREATE_USER_ERRORS",
    SET_CURRENT_USER = "SET_CURRENT_USER"
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface AllUserRolesFetched {
    type: UsersTypes.ALL_USER_ROLES_FETCHED;
    data: string[];
}

export interface ShowCreateUser {
    type: UsersTypes.SHOW_CREATE_USER;
    data: boolean;
}

export interface SetCreateUserError {
    type: UsersTypes.SET_CREATE_USER_ERRORS;
    errors: ErrorInfo[];
}

export interface SetCurrentUser {
    type: UsersTypes.SET_CURRENT_USER;
    data: string;
}

export type UsersAction =
    | AllUsersFetched
    | AllUserRolesFetched
    | ShowCreateUser
    | SetCreateUserError
    | SetCurrentUser
    ;