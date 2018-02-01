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

export const authActions = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>) => {
            try {
                const response = await authService().logIn(email, password)
                dispatch(this.tokenReceived(response.data.access_token));
            } catch(e) {
                dispatch(this.authenticationError(e.response.data.error));
            }
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            if (typeof(Storage) !== "undefined") {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const decoded: DecodedDataFromToken = decodeToken(token);
                    if (isExpired(decoded.exp)) {
                        console.log("Token is expired");
                        localStorage.removeItem("accessToken");
                        dispatch(this.logOut())
                    } else {
                        console.log("Found unexpired access token in local storage, so we're already logged in");
                        dispatch(this.tokenReceived(token));
                    }
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
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("accessToken", token);
                }
                dispatch({
                    type: TypeKeys.AUTHENTICATED,
                    data: user,
                });
                authService(getState).authToShiny();
                if (appName === "contrib") {
                    contribMainStore.load();
                }
            } else {
                notificationActions.notify(error);
            }
        }
    },

    authenticationError(error: string) {
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
            authService(getState).authToShiny();
            dispatch({
                type: TypeKeys.UNAUTHENTICATED,
            });
        }
    }
};
