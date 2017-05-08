import alt from '../alt';
import * as AltJS from 'alt';
import { RemoteContent }  from './RemoteContent'
import { AbstractStore } from './AbstractStore';
import { mainActions } from '../actions/MainActions';
import { touchstoneActions } from '../actions/TouchstoneActions';
import { Disease } from '../Models'

export interface State extends RemoteContent {
    loggedIn: boolean;
}

interface AuthStoreInterface extends AltJS.AltStore<State> {
}
class AuthStore extends AbstractStore<State> {
    loggedIn: boolean;

    constructor() {
        super();
        this.loggedIn = false;
    }
}

export const Store = alt.createStore<State>(AuthStore) as AuthStoreInterface;
