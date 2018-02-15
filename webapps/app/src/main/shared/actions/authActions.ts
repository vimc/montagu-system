import { Dispatch } from "redux";

import { jwtTokenAuth } from "../modules/jwtTokenAuth";
import { AuthService } from "../services/AuthService";
import { makeNotificationException, notificationActions} from "./NotificationActions";
import { appSettings, settings } from "../Settings";
import { appName } from 'appName';
import { mainStore as contribMainStore } from "../../contrib/stores/MainStore";
import { AuthTokenData } from "../modules/jwtTokenAuth";
import { AuthState } from "../reducers/authReducer";
import { makeNotification, Notification } from "../actions/NotificationActions";
import { localStorageHandler } from "../services/localStorageHandler";
import {
    AuthActionsTypes, Authenticated, AuthenticationError, AuthTypeKeys,
    Unauthenticated
} from "../actionTypes/AuthTypes";

export const authActions = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            try {
                const response = await (new AuthService(dispatch, getState)).logIn(email, password)
                if (response.error) {
                    dispatch(this.authenticationError(response.error));
                } else {
                    dispatch(this.tokenReceived(response.access_token));
                }
            } catch(error) {
                const errorNotification = this.makeNotificationError('Server error');
                notificationActions.notify(errorNotification);
                throw makeNotificationException(error.message, "error");
            }
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            const token = localStorageHandler.get("accessToken");
            if (token) {
                const decoded: AuthTokenData = jwtTokenAuth.decodeToken(token);
                if (jwtTokenAuth.isExpired(decoded.exp)) {
                    console.log("Token is expired");
                    localStorageHandler.remove("accessToken");
                    dispatch(this.logOut())
                } else {
                    console.log("Found unexpired access token in local storage, so we're already logged in");
                    dispatch(this.tokenReceived(token));
                }
            }
        }
    },

    validateAuthResult(user: any)  {
        if (!user.isAccountActive) {
            return this.makeNotificationError("Your account has been deactivated");
        }
        if (appSettings.requiresModellingGroupMembership && (!user.modellingGroups || !user.modellingGroups.length)) {
            return this.makeNotificationError( "Only members of modelling groups can log into the contribution portal");
        }
    },

    makeNotificationError(error: string) :Notification {
        if (!error) return null;
        const support = settings.supportContact;
        return makeNotification(`${error}. Please contact ${support} for help.`, "error")
    },

    tokenReceived(token: string) {
        return (dispatch: Dispatch<any>, getState: Function) => {
            const user: AuthState = jwtTokenAuth.getDataFromToken(token);
            const error: Notification = this.validateAuthResult(user);
            if (!error) {
                localStorageHandler.set("accessToken", token);
                dispatch({
                    type: AuthTypeKeys.AUTHENTICATED,
                    data: user,
                } as Authenticated);
                (new AuthService(dispatch, getState)).setShinyCookie();
                if (appName === "contrib") {
                    contribMainStore.load();
                }
            } else {
                notificationActions.notify(error);
                dispatch(this.authenticationError(error.message));
            }
        }
    },

    authenticationError(error: any) {
        return {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: error ? "Your username or password is incorrect" : "An error occurred logging in",
        } as AuthenticationError;
    },

    logOut() {
        return (dispatch: Dispatch<any>, getState: Function) => {
            localStorageHandler.remove("accessToken");
            (new AuthService(dispatch, getState)).clearShinyCookie();
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED,
            } as Unauthenticated);
        }
    }
};
