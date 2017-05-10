import alt from "../alt";
import * as AltJS from "alt";
import {AbstractStore} from "./AbstractStore";
import {authActions} from "../actions/AuthActions";
const jwt_decode = require('jwt-decode');
import {parseRole,Role} from '../models/Roles';

export interface State {
    loggedIn: boolean;
    bearerToken: string;
    permissions: string[];
    modellingGroups: string[];
}

interface AuthStoreInterface extends AltJS.AltStore<State> {}

class AuthStore extends AbstractStore<State> {
    loggedIn: boolean;
    bearerToken: string;
    permissions: string[];
    modellingGroups: string[];

    constructor() {
        super();
        this.loggedIn = false;
        this.bearerToken = null;
        this.permissions = [];
        this.modellingGroups = [];
        this.bindListeners({
            handleLogIn: authActions.logIn,
            handleLogOut: authActions.logOut
        })
    }

    handleLogIn(bearerToken: string) {
        this.loggedIn = true;
        this.bearerToken = bearerToken;
        const decoded = jwt_decode(bearerToken);
        this.permissions = decoded.permissions.split(",");
        this.modellingGroups = decoded.roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);

        if (this.permissions.some(x => x == "*/can-login")) {
            (authActions.logInAllowed as any).defer();
        } else {
            (authActions.logInForbidden as any).defer();
        }

        console.log("Saved bearer token");
    }

    handleLogOut() {
        this.loggedIn = false;
        this.bearerToken = null;
        alt.recycle();
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
