import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";

import { AuthenticationError, TypeKeys } from "../actionTypes/AuthTypes";
import {decodeToken, isExpired, getDataFromToken} from "../modules/JwtToken";
import { authService } from "../services/AuthService";
import {notificationActions} from "./NotificationActions";
import { appSettings, settings } from "../Settings";
import { appName } from 'appName';
import { mainStore as contribMainStore } from "../../contrib/stores/MainStore";

export const authActions = {

    logIn(email: string, password: string) {
        return (dispatch: Dispatch<any>) => {
            authService().logIn(email, password)
                .then((response: AxiosResponse) => {
                    dispatch(this.tokenReceived(response.data.access_token));
                })
                .catch((response: AxiosError) => {
                    dispatch(this.authenticationError(response.response.data.error));
                })
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            if (typeof(Storage) !== "undefined") {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const decoded = decodeToken(token);
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

    validateAutResult(user: any) {
        if (!user.isAccountActive) {
            return this.makeNotificationError("Your account has been deactivated");
        }
        if (appSettings.requiresModellingGroupMembership && (!user.modellingGroups || !user.modellingGroups.length)) {
            return this.makeNotificationError( "Only members of modelling groups can log into the contribution portal");
        }
    },

    makeNotificationError(error: string) {
        if (!error) return null;
        const support = settings.supportContact;
        return {message: `${error}. Please contact ${support} for help.`, type: "error"};
    },

    tokenReceived(token: string) {
        return (dispatch: Dispatch<any>, getState: any) => {
            const user = getDataFromToken(token);
            console.log("sett", appSettings, appName)
            const error: any = this.validateAutResult(user);
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

    authenticationError: (error: string): AuthenticationError => ({
        type: TypeKeys.AUTHENTICATION_ERROR,
        error: error ? "Your username or password is incorrect" : "An error occurred logging in",
    }),

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
