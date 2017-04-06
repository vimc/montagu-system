import alt from '../alt';
import * as AltJS from 'alt';
import { AbstractStore } from './AbstractStore';
import { touchstoneActions } from '../actions/TouchstoneActions';
import { YearRange } from '../models/YearRange';

export interface Touchstone {
    id: string;
    name: string,
    version: number;
    description: string;
    years: YearRange;
    status: string;
}

export interface State {
    touchstones: Array<Touchstone>;
    errorMessage: string;
}

interface TouchstoneStoreInterface extends AltJS.AltStore<State> { }

class TouchstoneStore extends AbstractStore<State> {
    touchstones: Array<Touchstone>;
    errorMessage: string;

    constructor() {
        super();
        this.touchstones = null;
        this.errorMessage = null;        
        this.bindListeners({
            handleFetch: touchstoneActions.fetch,
            handleUpdate: touchstoneActions.update,
            handleFetchFailed: touchstoneActions.fetchFailed
        });
    }
    handleFetch() {
        this.touchstones = null;
        this.errorMessage = null;
    }
    handleUpdate(touchstones: Array<Touchstone>) {
        this.touchstones = touchstones;
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = <TouchstoneStoreInterface>alt.createStore<State>(TouchstoneStore);