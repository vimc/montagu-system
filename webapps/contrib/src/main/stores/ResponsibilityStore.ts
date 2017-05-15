import alt from "../alt";
import * as AltJS from "alt";
import { RemoteContent } from "./RemoteContent";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import { AbstractStore } from "./AbstractStore";
import { Responsibilities, Touchstone } from "../Models";
import { ResponsibilitySource } from "../sources/ResponsibilitySource";
import { sources } from "../sources/Sources";
import { authActions, LogInProperties } from "../actions/AuthActions";

export interface State extends RemoteContent {
    currentTouchstone: Touchstone;
    currentModellingGroupId: string;
    responsibilitySet: Responsibilities;
    currentDiseaseId: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> {
    fetchResponsibilities(): void;
    isLoading(): boolean;
}

class ResponsibilityStore extends AbstractStore<State, ResponsibilityStoreInterface> {
    currentTouchstone: Touchstone;
    currentModellingGroupId: string;
    responsibilitySet: Responsibilities;
    currentDiseaseId: string;
    ready: boolean;

    constructor() {
        super();
        this.registerAsync(sources.responsibilities);
        this.bindListeners({
            handleSetTouchstone: responsibilityActions.setTouchstone,
            handleBeginFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.update,
            handleFilterByDisease: responsibilityActions.filterByDisease,
            handleLogIn: authActions.logIn
        });
    }

    initialState(): State {
        return {
            currentTouchstone: null,
            currentModellingGroupId: null,
            responsibilitySet: null,
            currentDiseaseId: null,
            ready: false
        };
    }

    handleSetTouchstone(touchstone: Touchstone) {
        this.currentTouchstone = touchstone;
    }

    handleBeginFetch() {
        this.responsibilitySet = null;
        this.ready = false;
        this.currentDiseaseId = null;
    }

    handleUpdateResponsibilities(responsibilitySet: Responsibilities) {
        this.responsibilitySet = responsibilitySet;
        this.ready = true;
    }

    handleFilterByDisease(diseaseId: string) {
        this.currentDiseaseId = diseaseId;
    }

    handleLogIn(loginProps: LogInProperties) {
        this.currentModellingGroupId = loginProps.modellingGroups[0];
    }
}

export const Store = <ResponsibilityStoreInterface>alt.createStore<State>(ResponsibilityStore);