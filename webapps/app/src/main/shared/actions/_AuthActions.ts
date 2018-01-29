import { Action, Dispatch } from "redux";
import { AxiosResponse, AxiosError } from "axios";

import { Authenticated, AuthenticationError, Unauthenticated, TypeKeys } from "../actionTypes/AuthTypes";
import { decodeToken, Token, isExpired, parseModellingGroups } from "../modules/JwtToken";


export const loadToken = () => (dispatch: Dispatch<any>) => {
    if (typeof(Storage) !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = decodeToken(token);
            if (isExpired(decoded.exp)) {
                console.log("Token is expired");
                localStorage.removeItem("accessToken");
                dispatch(logOut())
            } else {
                console.log("Found unexpired access token in local storage, so we're already logged in");
                dispatch(authenticated(token));
            }
        }
    }
}

export const authenticated = (token: string) => (dispatch: Dispatch<any>) => {
    const decoded: Token = decodeToken(token);
    const permissions = decoded.permissions.split(",").filter(x => x.length > 0);
    const modellingGroups = parseModellingGroups(decoded.roles)

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("accessToken", token);
    }
    dispatch ({
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
        type: "DO_AUTH_TO_SHINY_API"
    })
};

export const authenticationError = (error: AxiosError) :AuthenticationError => {
    return {
        type: TypeKeys.AUTHENTICATION_ERROR,
            error: error.response.data.error ? "Your username or password is incorrect" : "An error occurred logging in",
    }
};

export const logOut = () => (dispatch: Dispatch<any>) => {
    if (typeof(Storage) !== "undefined") {
        localStorage.clear();
    }
    dispatch({
        type: "DO_UNAUTH_TO_SHINY_API"
    })
    dispatch({
        type: TypeKeys.UNAUTHENTICATED,
    });
};

