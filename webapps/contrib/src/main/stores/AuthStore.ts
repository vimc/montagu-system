import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";
import * as MainStore from './MainStore';

export interface State {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups: string[];
}

interface AuthStoreInterface extends AltJS.AltStore<State> {
    logIn(access_token: string): void;
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

class AuthStore extends AbstractStore<State, AuthStoreInterface> {
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
        });
        this.exportPublicMethods({
            logIn: access_token => {
                authActions.logIn(access_token);
                if (this.loggedIn) {
                    MainStore.Store.load();
                }
            }
        })
    }

    initialState(): State {
        return initialState();
    }

    handleLogIn(props: LogInProperties) {
        if (props.isAccountActive && props.isModeller) {
            this.loggedIn = true;
            this.bearerToken = props.token;
            this.username = props.username;
            this.permissions = props.permissions;
            this.modellingGroups = props.modellingGroups;
            console.log("Saved bearer token");
        }
    }

    handleLogOut() {
        alt.recycle();
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
