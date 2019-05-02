import {Dispatch} from "redux";

import {jwtTokenAuth} from "../modules/jwtTokenAuth";
import {AuthService} from "../services/AuthService";
import {appSettings, settings} from "../Settings";
import {appName} from 'appName';
import {AuthState, loadAuthState} from "../reducers/authReducer";
import {
    Authenticated,
    AuthenticationError,
    AuthTypeKeys,
    ReceivedCookies,
    Unauthenticated
} from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";
import {notificationActionCreators} from "./notificationActionCreators";
import {ModellingGroup} from "../models/Generated";
import {ModellingGroupsService} from "../services/ModellingGroupsService";

export const authActionCreators = {

    logIn(email: string, password: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            try {
                const response = await (new AuthService(dispatch, getState)).logIn(email, password);
                if (response.error) {
                    dispatch(this.authenticationError(response.error));
                } else {
                    await dispatch(this.receivedCompressedToken(response.access_token));
                }
            } catch (error) {
                dispatch(notificationActionCreators.notify(this.makeErrorMessage("Server error"), "error"));
            }
        }
    },

    loadAuthenticatedUser() {
        // fetch details of currently logged in user from API.
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            try {
                const userResponse = await(new AuthService(dispatch, getState)).getCurrentUser();
                //TODO: since we should always have the modelling groups for the current user, either from the API here
                //or when loading from token on login, we shouldn't need the call that was added as part of
                //https://github.com/vimc/montagu-webapps/pull/380
                const allGroups: ModellingGroup[] = await (new ModellingGroupsService(dispatch, getState)).getUserGroups();

                const user: AuthState = loadAuthState(
                    userResponse.username,
                    true, //received bearer token
                    true, //received cookies
                    null, //bearerToken - shouldn't need this since already logged in with cookies if successful response
                    userResponse.permissions,
                    allGroups.map(x => x.id)
                )

                const error: string = this.validateAuthResult(user);
                if (!error) {
                    dispatch({
                        type: AuthTypeKeys.AUTHENTICATED,
                        data: user,
                    } as Authenticated);
                } else {
                    dispatch(notificationActionCreators.notify(error, "error"));
                    dispatch(this.authenticationError(error));
                }

            } catch (error) {
                console.log("Unable to load authenticated user details")
                dispatch(this.logOut())
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
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const user: AuthState = jwtTokenAuth.getDataFromCompressedToken(token);
            const error: string = this.validateAuthResult(user);
            if (!error) {
                dispatch({
                    type: AuthTypeKeys.AUTHENTICATED,
                    data: user,
                } as Authenticated);
                await dispatch(this.setCookies());
            } else {
                dispatch(notificationActionCreators.notify(error, "error"));
                dispatch(this.authenticationError(error));
            }
        }
    },

    setCookies() {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await new AuthService(dispatch, getState).setCookies();
            if (result) {
                dispatch({type: AuthTypeKeys.RECEIVED_COOKIES} as ReceivedCookies);
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
