import alt from '../alt';
import {AbstractActions} from "./AbstractActions";

interface Actions {
    logIn(token: string): string;
    logOut(): boolean;
    logInForbidden(reason: string): string;
    logInAllowed(): boolean;
}

class AuthActions extends AbstractActions implements Actions {
    logIn(token: string): string {
        return token;
    }
    logOut(): boolean {
        return true;
    }
    logInForbidden(reason: string): string {
        return reason;
    }
    logInAllowed(): boolean {
        return true;
    }
}

export const authActions = alt.createActions<Actions>(AuthActions);