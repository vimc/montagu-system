import alt from "../alt";
import * as AltJS from 'alt';
import { RemoteContent } from './RemoteContent';
import { responsibilityActions } from '../actions/ResponsibilityActions';
import { AbstractStore } from "./AbstractStore";
import { Touchstone, Responsibilities } from '../Models';
import { ResponsibilityFetchParameters } from '../sources/Sources';

export interface State extends RemoteContent {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> { }

class ResponsibilityStore extends AbstractStore<State> {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
    errorMessage: string;
    ready: boolean;

    constructor() {
        super();
        this.currentTouchstone = null;
        this.responsibilitySet = null;
        this.errorMessage = null;
        this.ready = false;
        this.bindListeners({
            handleSetTouchstone: responsibilityActions.setTouchstone,
            handleFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.updateResponsibilities,
            handleFetchFailed: responsibilityActions.fetchFailed
        });
    }

    handleSetTouchstone(touchstone: Touchstone) {
        this.currentTouchstone = touchstone;
        const action: any = responsibilityActions.fetch;
        const params: ResponsibilityFetchParameters = { 
            groupId: "group-1",
            touchstoneId: this.currentTouchstone.id
        };
        action.defer(params);
    }
    handleFetch() {
        this.responsibilitySet = null;
        this.errorMessage = null;
        this.ready = false;
    }
    handleUpdateResponsibilities(responsibilitySet: Responsibilities) {
        this.responsibilitySet = responsibilitySet;
        this.ready = true;
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.ready = false;
    }
}

export const Store = <ResponsibilityStoreInterface>alt.createStore<State>(ResponsibilityStore);