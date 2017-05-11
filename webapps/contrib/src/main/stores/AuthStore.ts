import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { parseRole, Role } from "../models/Roles";
const jwt_decode = require('jwt-decode');

export interface State {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups: string[];
}

interface AuthStoreInterface extends AltJS.AltStore<State> {
}

export function initialState(): State {
    return {
        loggedIn: false,
        username: null,
        bearerToken: null,
        permissions: [],
        modellingGroups: []
    };
}

class AuthStore extends AbstractStore<State> {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups: string[];

    constructor() {
        super();
        this.bindListeners({
            handleLogIn: authActions.logIn,
            handleLogOut: authActions.logOut
        })
    }

    initialState(): State {
        return initialState();
    }

    handleLogIn(props: LogInProperties) {
        this.loggedIn = true;
        this.bearerToken = props.token;
        this.username = props.username;
        this.permissions = props.permissions;
        this.modellingGroups = props.modellingGroups;
        console.log("Saved bearer token");
    }

    handleLogOut() {
        alt.recycle();
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
