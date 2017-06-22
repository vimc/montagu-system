import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";

export interface AuthStateBase {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
}

export interface AuthStoreBaseInterface<TState> extends AltJS.AltStore<TState> {
    logIn(access_token: string): void;
    loadAccessToken(): void;
}

export abstract class AuthStore<TState extends AuthStateBase, TInterface extends AuthStoreBaseInterface<TState>>
    extends AbstractStore<TState, TInterface>
{
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];

    constructor() {
        super();
        this.bindListeners({
            handleLogIn: authActions.logIn,
            handleLogOut: authActions.logOut,
        });
        this.exportPublicMethods({
            logIn: accessToken => this.doLogIn(accessToken),
            loadAccessToken: () => {
                if (typeof(Storage) !== "undefined") {
                    const token = localStorage.getItem("accessToken");
                    if (token) {
                        console.log("Found access token in local storage. Restoring authenticated session");
                        this.doLogIn(token);
                    }
                }
            }
        })
    }

    static baseInitialState(): AuthStateBase {
        return {
            bearerToken: null,
            loggedIn: false,
            username: null,
            permissions: []
        };
    }

    protected doLogIn(accessToken: string) {
        authActions.logIn(accessToken);
    }

    protected canLogIn(props: LogInProperties) {
        return props.isAccountActive;
    }

    protected saveLoginProps(props: LogInProperties) {
        this.loggedIn = true;
        this.bearerToken = props.token;
        this.username = props.username;
        this.permissions = props.permissions;

        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("accessToken", this.bearerToken);
        }
    }

    handleLogIn(props: LogInProperties) {
        if (this.canLogIn(props)) {
            this.saveLoginProps(props);
        }
    }

    handleLogOut() {
        alt.recycle();
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
        }
    }
}
