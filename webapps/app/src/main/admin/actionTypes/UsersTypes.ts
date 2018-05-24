import {User} from "../../shared/models/Generated";

export enum UsersTypes {
    ALL_USERS_FETCHED = "ALL_USERS_FETCHED",
    SET_CREATE_USER_ERROR = "SET_CREATE_USER_ERROR",
}

export interface AllUsersFetched {
    type: UsersTypes.ALL_USERS_FETCHED;
    data: User[];
}

export interface SetCreateUserError {
    type: UsersTypes.SET_CREATE_USER_ERROR;
    error: string;
}

export type UsersAction =
    | AllUsersFetched
    | SetCreateUserError
