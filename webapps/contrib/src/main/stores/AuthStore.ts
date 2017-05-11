import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions } from "../actions/AuthActions";
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

    handleLogIn(bearerToken: string) {
        this.loggedIn = true;
        this.bearerToken = bearerToken;
        const decoded = jwt_decode(bearerToken);
        this.username = decoded.sub;
        this.permissions = decoded.permissions.split(",");
        this.modellingGroups = decoded.roles
            .split(",")
            .map((x: string) => parseRole(x))
            .filter((x: Role) => x.name == "member" && x.scope.prefix == "modelling-group")
            .map((x: Role) => x.scope.id);

        const accountActive = this.permissions.some(x => x == "*/can-login");
        const modeller = this.modellingGroups.length > 0;

        if (accountActive && modeller) {
            (authActions.logInAllowed as any).defer();
        } else {
            const action: any = authActions.logInForbidden;
            if (!accountActive) {
                action.defer("Your account has been deactivated");
            } else {
                action.defer("Only members of modelling groups can log into the contribution portal");
            }
        }

        console.log("Saved bearer token: " + this.bearerToken);
    }

    handleLogOut() {
        alt.recycle();
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
