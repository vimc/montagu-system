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
}

export abstract class AuthStoreBase<TState extends AuthStateBase, TInterface extends AuthStoreBaseInterface<TState>>
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
            logIn: accessToken => this.doLogIn(accessToken)
        })
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
    }

    handleLogIn(props: LogInProperties) {
        if (this.canLogIn(props)) {
            this.saveLoginProps(props);
        }
    }

    handleLogOut() {
        alt.recycle();
    }
}
