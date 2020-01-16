import {Dispatch} from "redux";

import {AuthService} from "../services/AuthService";
import {appSettings, settings} from "../Settings";
import {AuthState, loadAuthState} from "../reducers/authReducer";
import {
    Authenticated, AuthenticationError,
    AuthTypeKeys,
    ReceivedCookies,
    Unauthenticated
} from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";
import {notificationActionCreators} from "./notificationActionCreators";
import {ModellingGroup} from "../models/Generated";
import {ModellingGroupsService} from "../services/ModellingGroupsService";

export const authActionCreators = {

    loadAuthenticatedUser() {
        // fetch details of currently logged in user from API.
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            try {
                const userResponse = await(new AuthService(dispatch, getState)).getCurrentUser();
                const allGroups: ModellingGroup[] = await (new ModellingGroupsService(dispatch, getState))
                    .setOptions({notificationOnError: false})
                    .getUserGroups();

                const user: AuthState = loadAuthState({
                    username: userResponse.username,
                    loggedIn: true,
                    bearerToken: getState().auth.bearerToken, // this will be null except when running integration tests
                    permissions: userResponse.permissions,
                    modellingGroups: allGroups.map(x => x.id)
                });

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
                console.log("Unable to load authenticated user details");
                dispatch(this.logOut())
            }
        }
    },

    validateAuthResult(user: AuthState): string {
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
    }
};
