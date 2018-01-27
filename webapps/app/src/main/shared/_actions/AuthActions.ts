import { Action, Dispatch } from 'redux';

import { authService } from '../services/AuthService';
import {decodeToken, Token, isExpired, parseModellingGroups} from "../modules/JwtToken";
import {setShinyToken} from "../sources/LoginSource";

export const login = (email :string, password: string) => (dispatch: Dispatch<any>) => {
    authService().logIn(email, password)
        .then((response: any) => {
            dispatch(authenticated(response.data.access_token))
        })
        .catch((error: any) => {
            dispatch(authenticationError(error))
        })
};

export const loadToken = () => (dispatch: Dispatch<any>): any => {
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
    return null;
}


export const authenticated = (token: string) => (dispatch: Dispatch<any>) => {
    const decoded: Token = decodeToken(token);
    const permissions = decoded.permissions.split(",").filter(x => x.length > 0);
    const modellingGroups = parseModellingGroups(decoded.roles)


    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("accessToken", token);
    }
    setShinyToken();

    dispatch( {
        type: 'AUTHENTICATED',
        data: {
            loggedIn: true,
            bearerToken: token,
            username: decoded.sub,
            permissions,
            modellingGroups
        },
    })
};

export const authenticationError = (error: any) => {
    return {
        type: 'AUTHENTICATION_ERROR',
            error: error.response.data.error ? "Your username or password is incorrect" : "An error occurred logging in",
    }
};

export const logOut = () => {
    if (typeof(Storage) !== "undefined") {
        localStorage.clear();
    }
    return {
        type: 'UNAUTHENTICATED',
    };
};

