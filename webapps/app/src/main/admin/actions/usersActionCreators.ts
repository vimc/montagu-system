import {Dispatch} from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {User} from "../../shared/models/Generated";
import {UsersService} from "../services/UsersService";
import {
    AllGlobalRolesFetched,
    AllUsersFetched,
    SetCreateUserError,
    SetCurrentUser,
    ShowCreateUser,
    UsersTypes
} from "../actionTypes/UsersTypes";
import {CreateUserFormFields} from "../components/Users/Create/CreateUserForm";

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

    createUser(values: CreateUserFormFields) {
        const {name, email, username} = values;
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

    getGlobalRoles() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const roles: string[] = await (new UsersService(dispatch, getState)).getGlobalRoles();
            dispatch({
                type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED,
                data: roles
            } as AllGlobalRolesFetched);
        }
    },

    addGlobalRoleToUser(username: string, role: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState)).addGlobalRoleToUser(username, role);

            if (result === "OK") {
                await this._refreshUser(dispatch, username);
            }
        }
    },

    removeRoleFromUser(username: string, role: string, scopeId: string, scopePrefix: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new UsersService(dispatch, getState))
                .removeRoleFromUser(username, role, scopeId, scopePrefix);

            if (result === "OK") {
                await this._refreshUser(dispatch, username);
            }
        }
    },

    async _refreshUser(dispatch: Dispatch<AdminAppState>, username: string) {
        dispatch(this.clearUsersListCache());
        await dispatch(this.getAllUsers());
        dispatch(this.setCurrentUser(username));
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
