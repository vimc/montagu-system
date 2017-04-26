import alt from '../alt';
import * as AltJS from 'alt';
import { RemoteContent }  from './RemoteContent'
import { AbstractStore } from './AbstractStore';
import { touchstoneActions } from '../actions/TouchstoneActions';
import { Touchstone } from '../Models'

export interface State extends RemoteContent {
    touchstones: Array<Touchstone>;
}

interface TouchstoneStoreInterface extends AltJS.AltStore<State> { }

class TouchstoneStore extends AbstractStore<State> {
    touchstones: Array<Touchstone>;
    errorMessage: string;
    ready: boolean;

    constructor() {
        super();
        this.touchstones = null;
        this.errorMessage = null;
        this.ready = false;    
        this.bindListeners({
            handleBeginFetch: touchstoneActions.beginFetch,
            handleUpdate: touchstoneActions.update,
            handleFetchFailed: touchstoneActions.fetchFailed
        });
    }
    handleBeginFetch() {
        this.touchstones = null;
        this.errorMessage = null;
        this.ready = false;
    }
    handleUpdate(touchstones: Array<Touchstone>) {
        this.touchstones = touchstones;
        this.ready = true;
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.ready = false;
    }
}

export const Store = alt.createStore<State>(TouchstoneStore) as TouchstoneStoreInterface;