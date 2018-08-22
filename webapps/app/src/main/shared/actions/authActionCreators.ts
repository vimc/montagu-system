import {Dispatch} from "redux";

import {jwtTokenAuth} from "../modules/jwtTokenAuth";
import {AuthService} from "../services/AuthService";
import {appSettings, settings} from "../Settings";
import {appName} from 'appName';
import {AuthState} from "../reducers/authReducer";
import {localStorageHandler} from "../services/localStorageHandler";
import {Authenticated, AuthenticationError, AuthTypeKeys, Unauthenticated} from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";
import {notificationActionCreators} from "./notificationActionCreators";

export const authActionCreators = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            try {
                const response = await (new AuthService(dispatch, getState)).logIn(email, password);
                if (response.error) {
                    dispatch(this.authenticationError(response.error));
                } else {
                    dispatch(this.receivedCompressedToken(response.access_token));
                }
            } catch (error) {
                dispatch(notificationActionCreators.notify(this.makeErrorMessage("Server error"), "error"));
            }
        }
    },

    loadSavedToken() {
        return (dispatch: Dispatch<any>) => {
            const token = localStorageHandler.get("accessToken");
            if (token) {
                const inflated = jwtTokenAuth.inflateToken(token);
                const decoded = inflated && jwtTokenAuth.decodeToken(inflated);

                if (!decoded) {
                    console.log("Invalid token. Logging out");
                    dispatch(this.logOut());
                }
                else if (jwtTokenAuth.isExpired(decoded.exp)) {
                    console.log("Token is expired");
                    dispatch(this.logOut())
                } else {
                    console.log("Found unexpired access token in local storage, so we're already logged in");
                    dispatch(this.receivedCompressedToken(token));
                }

            }
        }
    },

    validateAuthResult(user: any): string {
        if (!user.isAccountActive) {
            return this.makeErrorMessage("Your account has been deactivated");
        }
        if (appSettings.requiresModellingGroupMembership && (!user.modellingGroups || !user.modellingGroups.length)) {
            return this.makeErrorMessage("Only members of modelling groups can log into the contribution portal");
        }
    },

    makeErrorMessage(error: string): string {
        const support = settings.supportContact;
        return `${error}. Please contact ${support} for help.`;
    },

    receivedCompressedToken(token: string) {
        return (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const user: AuthState = jwtTokenAuth.getDataFromCompressedToken(token);
            const error: string = this.validateAuthResult(user);
            if (!error) {
                // Save the compressed version of the token
                localStorageHandler.set("accessToken", user.bearerToken);
                dispatch({
                    type: AuthTypeKeys.AUTHENTICATED,
                    data: user,
                } as Authenticated);
                (new AuthService(dispatch, getState)).setShinyCookie();
            } else {
                dispatch(notificationActionCreators.notify(error, "error"));
                dispatch(this.authenticationError(error));
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
        return (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            localStorageHandler.remove("accessToken");
            (new AuthService(dispatch, getState))
                .clearAllCache()
                .logOutOfAPI();
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED,
            } as Unauthenticated);
        }
    },

    forgotPassword(email: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new AuthService(dispatch, getState)).forgotPassword(email);
            if (result) {
                dispatch(notificationActionCreators.notify(
                    "Thank you. If we have an account registered for this email address you will receive a reset password link",
                    "info"
                ));
            }
        }
    }
};
