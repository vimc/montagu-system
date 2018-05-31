import {Dispatch} from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {
    AllUserRolesFetched, AllUsersFetched, SetCreateUserError, SetCurrentUser,
    UsersTypes
} from "../actionTypes/UsersTypes";

export const usersActionCreators = {

    getAllUsers() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const users: User[] = await (new UsersService(dispatch, getState)).getAllUsers();
            dispatch({
                type: UsersTypes.ALL_USERS_FETCHED,
                data: users
            } as AllUsersFetched);
        }
    },

    createUser(name: string, email: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState)).createUser(name, email, username);
            if (result && result.errors) {
                dispatch({
                    type: UsersTypes.SET_CREATE_USER_ERRORS,
                    errors: result.errors
                } as SetCreateUserError);
            } else if (result) {
                dispatch(this.clearUsersListCache());
                await dispatch(this.getAllUsers());
            } else {
                dispatch({
                    type: UsersTypes.SET_CREATE_USER_ERRORS,
                    errors: [{message: "Could not create user"}]
                } as SetCreateUserError);
            }
        }
    },

    setCurrentUser(username: string) {
        return {
            type: UsersTypes.SET_CURRENT_USER,
            data: username
        } as SetCurrentUser
    },

    clearUsersListCache() {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            (new UsersService(dispatch, getState)).clearUsersListCache();
        }
    },
};
