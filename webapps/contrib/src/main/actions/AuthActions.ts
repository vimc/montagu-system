import alt from '../alt';
import {AbstractActions} from "./AbstractActions";

interface Actions {
    logIn(token: string): string;
}

class AuthActions extends AbstractActions implements Actions {
    logIn(token: string): string {
        return token;
    }
}

export const authActions = alt.createActions<Actions>(AuthActions);