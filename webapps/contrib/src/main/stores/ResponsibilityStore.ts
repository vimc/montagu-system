import alt from "../alt";
import * as AltJS from 'alt';
import { responsibilityActions } from '../actions/ResponsibilityActions';
import { AbstractStore } from "./AbstractStore";
import { Touchstone, Responsibilities } from '../Models';

export interface State {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
    errorMessage: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> { }

class ResponsibilityStore extends AbstractStore<State> {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
    errorMessage: string;

    constructor() {
        super();
        this.currentTouchstone = null;
        this.responsibilitySet = null;
        this.errorMessage = null;
        this.bindListeners({
            handleSetTouchstone: responsibilityActions.setTouchstone,
            handleFetch: responsibilityActions.fetch,
            handleUpdateResponsibilities: responsibilityActions.updateResponsibilities,
            handleFetchFailed: responsibilityActions.fetchFailed
        });
    }

    handleSetTouchstone(touchstone: Touchstone) {
        this.currentTouchstone = touchstone;
        const action: any = responsibilityActions.fetch;
        action.defer("group-1", this.currentTouchstone.id);
    }
    handleFetch() {
        this.responsibilitySet = null;
        this.errorMessage = null;
    }
    handleUpdateResponsibilities(responsibilitySet: Responsibilities) {
        this.responsibilitySet = responsibilitySet;
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = <ResponsibilityStoreInterface>alt.createStore<State>(ResponsibilityStore);