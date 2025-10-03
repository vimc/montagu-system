import {ErrorInfo, User} from "../../shared/models/APITypes";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    ALL_GLOBAL_ROLES_FETCHED = "ALL_GLOBAL_ROLES_FETCHED",
    SHOW_CREATE_USER = "SHOW_CREATE_USER",
    SET_CREATE_USER_ERRORS = "SET_CREATE_USER_ERRORS",
    CHANGE_SET_PASSWORD_ERRORS = "CHANGE_SET_PASSWORD_ERRORS",
    CHANGE_SET_PASSWORD_TOKEN = "CHANGE_SET_PASSWORD_TOKEN",
    SET_CURRENT_USER = "SET_CURRENT_USER"
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface AllGlobalRolesFetched {
    type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED;
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

export interface ChangeSetPasswordErrors {
    type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS;
    errors: ErrorInfo[];
}

export interface ChangeSetPasswordToken {
    type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN;
    token: string;
}

export interface SetCurrentUser {
    type: UsersTypes.SET_CURRENT_USER;
    data: string;
}

export interface ShowCreateUser {
    type: UsersTypes.SHOW_CREATE_USER;
    data: boolean;
}

export type UsersAction =
    | AllUsersFetched
    | AllGlobalRolesFetched
    | ShowCreateUser
    | SetCreateUserError
    | ChangeSetPasswordErrors
    | ChangeSetPasswordToken
    | SetCurrentUser
