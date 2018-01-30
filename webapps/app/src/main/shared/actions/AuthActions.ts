import { Dispatch } from "redux";
import { AxiosError } from "axios";

import { AuthenticationError, TypeKeys } from "../actionTypes/AuthTypes";
import { decodeToken, Token, isExpired, parseModellingGroups } from "../modules/JwtToken";

export const AuthActions = {

    loadToken() {
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
                        dispatch(this.authenticated(token));
                    }
                }
            }
        }
    },

    authenticated(token: string) {
        return  (dispatch: Dispatch<any>) => {
            const decoded: Token = decodeToken(token);
            const permissions = decoded.permissions.split(",").filter(x => x.length > 0);
            console.log("roles",decoded.roles)
            const modellingGroups = parseModellingGroups(decoded.roles)

            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("accessToken", token);
            }
            dispatch({
                type: TypeKeys.AUTHENTICATED,
                data: {
                    loggedIn: true,
                    bearerToken: token,
                    username: decoded.sub,
                    permissions,
                    modellingGroups
                },
            });

            dispatch({
                type: TypeKeys.DO_AUTH_TO_SHINY_API
            })
        }
    },

    authenticationError(error: AxiosError): AuthenticationError {
        return {
            type: TypeKeys.AUTHENTICATION_ERROR,
            error: error.response.data.error ? "Your username or password is incorrect" : "An error occurred logging in",
        }
    },

    logOut() {
        return (dispatch: Dispatch<any>) => {
            if (typeof(Storage) !== "undefined") {
                localStorage.clear();
            }
            dispatch({
                type: TypeKeys.DO_UNAUTH_FROM_SHINY_API
            })
            dispatch({
                type: TypeKeys.UNAUTHENTICATED,
            });
        }
    }

};
