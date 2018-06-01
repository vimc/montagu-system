import {ErrorInfo, User} from "../../shared/models/Generated";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    SHOW_CREATE_USER = "SHOW_CREATE_USER",
    SET_CREATE_USER_ERRORS = "SET_CREATE_USER_ERRORS",
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface SetCreateUserError {
    type: UsersTypes.SET_CREATE_USER_ERRORS;
    errors: ErrorInfo[];
}

export interface ShowCreateUser {
    type: UsersTypes.SHOW_CREATE_USER;
    data: boolean;
}

export type UsersAction =
    | AllUsersFetched
    | SetCreateUserError
    | ShowCreateUser
