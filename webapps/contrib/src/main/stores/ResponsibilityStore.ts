import alt from "../alt";
import * as AltJS from "alt";
import {RemoteContent} from "./RemoteContent";
import {responsibilityActions} from "../actions/ResponsibilityActions";
import {AbstractStore} from "./AbstractStore";
import {Responsibilities, Touchstone} from "../Models";
import {ResponsibilityFetchParameters} from "../sources/Sources";
import {authActions} from "../actions/AuthActions";

export interface State extends RemoteContent {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
    currentDiseaseId: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> {
}

class ResponsibilityStore extends AbstractStore<State> {
    currentTouchstone: Touchstone;
    responsibilitySet: Responsibilities;
    currentDiseaseId: string;
    errorMessage: string;
    ready: boolean;

    constructor() {
        super();
        this.initialState();
        this.bindListeners({
            handleSetTouchstone: responsibilityActions.setTouchstone,
            handleFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.updateResponsibilities,
            handleFetchFailed: responsibilityActions.fetchFailed,
            handleFilterByDisease: responsibilityActions.filterByDisease
        });
    }

    initialState() {
        this.currentTouchstone = null;
        this.responsibilitySet = null;
        this.currentDiseaseId = null;
        this.errorMessage = null;
        this.ready = false;
    }

    handleSetTouchstone(touchstone: Touchstone) {
        this.currentTouchstone = touchstone;
    }

    handleFetch() {
        this.responsibilitySet = null;
        this.errorMessage = null;
        this.ready = false;
        this.currentDiseaseId = null;
    }

    handleUpdateResponsibilities(responsibilitySet: Responsibilities) {
        this.responsibilitySet = responsibilitySet;
        this.ready = true;
    }

    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
        this.ready = false;
    }

    handleFilterByDisease(diseaseId: string) {
        this.currentDiseaseId = diseaseId;
    }
}

export const Store = <ResponsibilityStoreInterface>alt.createStore<State>(ResponsibilityStore);