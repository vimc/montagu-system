import { Dispatch } from "redux";

import { TypeKeys } from "../actionTypes/AuthTypes";
import { jwtTokenAuth } from "../modules/jwtTokenAuth";
import { AuthService } from "../services/AuthService";
import { notificationActions } from "./NotificationActions";
import { appSettings, settings } from "../Settings";
import { appName } from 'appName';
import { mainStore as contribMainStore } from "../../contrib/stores/MainStore";
import { AuthTokenData } from "../modules/jwtTokenAuth";
import { AuthState } from "../reducers/authReducer";
import { makeNotification, Notification } from "../actions/NotificationActions";
import { localStorageHandler } from "../services/localStorageHandler";

export const authActions = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>, getState: any) => {
            try {
                const response = await (new AuthService(dispatch, getState)).logIn(email, password)
                console.log('response login', response);
                dispatch(this.tokenReceived(response.data.access_token));
            } catch(e) {
                console.log('response login err', e);
                dispatch(this.authenticationError(e.response ? e.response.data.error : "Server Error"));
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
        return (dispatch: Dispatch<any>, getState: any) => {
            console.log('tok rec');
            const user: AuthState = jwtTokenAuth.getDataFromToken(token);
            const error: Notification = this.validateAuthResult(user);
            if (!error) {
                console.log('will auth');
                localStorageHandler.set("accessToken", token);
                dispatch({
                    type: TypeKeys.AUTHENTICATED,
                    data: user,
                });
                (new AuthService(dispatch, getState)).authToShiny();
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
            type: TypeKeys.AUTHENTICATION_ERROR,
            error: error ? "Your username or password is incorrect" : "An error occurred logging in",
        };
    },

    logOut() {
        return (dispatch: Dispatch<any>, getState: any) => {
            localStorageHandler.remove("accessToken");
            (new AuthService(dispatch, getState)).unauthFromShiny();
            dispatch({
                type: TypeKeys.UNAUTHENTICATED,
            });
        }
    }
};
