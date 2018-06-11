import {Dispatch} from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {
    AllUserRolesFetched,
    AllUsersFetched, SetCreateUserError, SetCurrentUser, ShowCreateUser,
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
                dispatch(this.setShowCreateUser(false));
                await dispatch(this.getAllUsers());
            } else {
                dispatch({
                    type: UsersTypes.SET_CREATE_USER_ERRORS,
                    errors: [{message: "Could not create user"}]
                } as SetCreateUserError);
            }
        }
    },

    getAllUserRoles() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const userRoles: string[] = await (new UsersService(dispatch, getState)).getAllUserRoles();
            dispatch({
                type: UsersTypes.ALL_USER_ROLES_FETCHED,
                data: userRoles
            } as AllUserRolesFetched);
        }
    },

    addRoleToUser(username: string, role: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState)).addRoleToUser(username, role);

            if (result === "OK") {
                dispatch(this.clearUsersListCache());
                await dispatch(this.getAllUsers());
                dispatch(this.setCurrentUser(username));
            }
        }
    },

    removeRoleFromUser(username: string, role: string, scopeId: string, scopePrefix: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState))
                .removeRoleFromUser(username, role, scopeId, scopePrefix);

            if (result === "OK") {
                dispatch(this.clearUsersListCache());
                await dispatch(this.getAllUsers());
                dispatch(this.setCurrentUser(username));
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

    setShowCreateUser(value: boolean) {
        return {
            type: UsersTypes.SHOW_CREATE_USER,
            data: value
        } as ShowCreateUser;
    },
};
