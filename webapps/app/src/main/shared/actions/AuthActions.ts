import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";

import { AuthenticationError, TypeKeys } from "../actionTypes/AuthTypes";
import { decodeToken, isExpired, getDataFromToken } from "../modules/JwtTokenAuth";
import { authService } from "../services/AuthService";
import { notificationActions } from "./NotificationActions";
import { appSettings, settings } from "../Settings";
import { appName } from 'appName';
import { mainStore as contribMainStore } from "../../contrib/stores/MainStore";
import { DecodedDataFromToken } from "../modules/jwtTokenAuth";
import { AuthState } from "../reducers/authReducer";
import { makeNotification, Notification } from "../actions/NotificationActions";
import { localStorageHandler } from "../services/localStorageHandler";

export const authActions = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>) => {
            try {
                const response = await authService().logIn(email, password)
                dispatch(this.tokenReceived(response.data.access_token));
            } catch(e) {
                dispatch(this.authenticationError(e.response ? e.response.data.error : "Server Error"));
            }
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            const token = localStorageHandler.get("accessToken");
            if (token) {
                const decoded: DecodedDataFromToken = decodeToken(token);
                if (isExpired(decoded.exp)) {
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
        return (dispatch: Dispatch<any>, getState: any) => {
            const user: AuthState = getDataFromToken(token);
            const error: Notification = this.validateAuthResult(user);
            if (!error) {
                localStorageHandler.set("accessToken", token);
                dispatch({
                    type: TypeKeys.AUTHENTICATED,
                    data: user,
                });
                authService(dispatch, getState).authToShiny();
                if (appName === "contrib") {
                    contribMainStore.load();
                }
            } else {
                notificationActions.notify(error);
            }
        }
    },

    authenticationError(error: any) {
        return {
            type: TypeKeys.AUTHENTICATION_ERROR,
            error: error ? "Your username or password is incorrect" : "An error occurred logging in",
        };
    },

    logOut() {
        return (dispatch: Dispatch<any>, getState: any) => {
            if (typeof(Storage) !== "undefined") {
                localStorage.clear();
            }
            authService(dispatch, getState).authToShiny();
            dispatch({
                type: TypeKeys.UNAUTHENTICATED,
            });
        }
    }
};
