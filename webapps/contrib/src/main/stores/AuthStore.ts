import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { mainStore } from "./MainStore";
import { ModellingGroup } from "../models/Generated";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { responsibilityActions } from "../actions/ResponsibilityActions";

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups: ModellingGroup[];
}

interface AuthStoreInterface extends AltJS.AltStore<AuthState> {
    logIn(access_token: string): void;
}

export function initialAuthState(): AuthState {
    return {
        loggedIn: false,
        username: null,
        bearerToken: null,
        permissions: [],
        modellingGroups: []
    };
}

class AuthStore extends AbstractStore<AuthState, AuthStoreInterface> {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups: ModellingGroup[];
    modellingGroupIds: string[];

    constructor() {
        super();
        this.modellingGroupIds = [];
        this.bindListeners({
            handleLogIn: authActions.logIn,
            handleLogOut: authActions.logOut,
            handleModellingGroups: modellingGroupActions.update
        });
        this.exportPublicMethods({
            logIn: access_token => {
                authActions.logIn(access_token);
                if (this.loggedIn) {
                    mainStore.load();
                }
            }
        })
    }

    initialState(): AuthState {
        return initialAuthState();
    }

    handleLogIn(props: LogInProperties) {
        if (props.isAccountActive && props.isModeller) {
            this.loggedIn = true;
            this.bearerToken = props.token;
            this.username = props.username;
            this.permissions = props.permissions;
            this.modellingGroupIds = props.modellingGroups;
            console.log("Saved bearer token");
        }
    }

    handleLogOut() {
        alt.recycle();
    }

    handleModellingGroups(groups: ModellingGroup[]) {
        this.modellingGroups = this.modellingGroupIds.map(id => groups.find(g => g.id == id));
    }
}

export const authStore = alt.createStore<AuthState>(AuthStore) as AuthStoreInterface;
