import alt from "../alt";
import * as AltJS from 'alt';
import { responsibilityActions } from '../actions/ResponsibilityActions';
import { AbstractStore } from "./AbstractStore";
import { Touchstone } from '../stores/TouchstoneStore';

export interface Scenario {
    id: string;
    touchstones: Array<string>;
    description: string;
    disease: string;
}

export interface Responsibility {
    scenario: Scenario;
    status: string;
    problems: Array<string>;
}

export interface ResponsibilitySet {    
    responsibilities: Array<Responsibility>;
    touchstone: string;
    status: string;
    problems: string;
}

export interface State {
    currentTouchstone: Touchstone;
    responsibilitySet: ResponsibilitySet;
    errorMessage: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> { }

class ResponsibilityStore extends AbstractStore<State> {
    currentTouchstone: Touchstone;
    responsibilitySet: ResponsibilitySet;
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
    handleUpdateResponsibilities(responsibilitySet: ResponsibilitySet) {
        this.responsibilitySet = responsibilitySet;
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = <ResponsibilityStoreInterface>alt.createStore<State>(ResponsibilityStore);