import { Action, Dispatch } from "redux";
import { AxiosResponse, AxiosError } from "axios";

import { Authenticated, AuthenticationError, Unauthenticated, TypeKeys } from "../actionTypes/AuthTypes";
import { authService } from "../services/AuthService";
import { decodeToken, Token, isExpired, parseModellingGroups } from "../modules/JwtToken";
import { setShinyToken } from "../sources/LoginSource";

export const login = (email :string, password: string) => (dispatch: Dispatch<any>) => {
    authService().logIn(email, password)
        .then((response: AxiosResponse) => {
            dispatch(authenticated(response.data.access_token))
        })
        .catch((error: AxiosError) => {
            dispatch(authenticationError(error))
        })
};

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


export const authenticated = (token: string) : Authenticated => {
    const decoded: Token = decodeToken(token);
    const permissions = decoded.permissions.split(",").filter(x => x.length > 0);
    const modellingGroups = parseModellingGroups(decoded.roles)

    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("accessToken", token);
    }
    setShinyToken();

    return {
        type: TypeKeys.AUTHENTICATED,
        data: {
            loggedIn: true,
            bearerToken: token,
            username: decoded.sub,
            permissions,
            modellingGroups
        },
    }
};

export const authenticationError = (error: AxiosError) :AuthenticationError => {
    return {
        type: TypeKeys.AUTHENTICATION_ERROR,
            error: error.response.data.error ? "Your username or password is incorrect" : "An error occurred logging in",
    }
};

export const logOut = () :Unauthenticated => {
    if (typeof(Storage) !== "undefined") {
        localStorage.clear();
    }
    return {
        type: TypeKeys.UNAUTHENTICATED,
    };
};

