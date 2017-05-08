import alt from '../alt';
import * as AltJS from 'alt';
import { AbstractStore } from './AbstractStore';
import { authActions } from '../actions/AuthActions';

export interface State {
    loggedIn: boolean;
    bearerToken: string;
}

interface AuthStoreInterface extends AltJS.AltStore<State> {
}
class AuthStore extends AbstractStore<State> {
    loggedIn: boolean;
    bearerToken: string;

    constructor() {
        super();
        this.loggedIn = false;
        this.bearerToken = null;
        this.bindListeners({
            handleLogIn: authActions.logIn,
            handleLogOut: authActions.logOut
        })
    }

    handleLogIn(bearerToken: string) {
        this.loggedIn = true;
        this.bearerToken = bearerToken;
        console.log("Saved bearer token");
    }
    handleLogOut() {
        this.loggedIn = false;
        this.bearerToken = null;
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
