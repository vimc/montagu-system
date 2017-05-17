import alt from "../alt";
import * as AltJS from "alt";
import { RemoteContent } from "./RemoteContent";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import { AbstractStore } from "./AbstractStore";
import { Responsibilities, Responsibility, Touchstone } from "../models/Generated";
import { sources } from "../sources/Sources";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { ExtendedResponsibilitySet } from "../models/ResponsibilitySet";

export interface State extends RemoteContent {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: Responsibility;

    currentModellingGroupId: string;
    currentDiseaseId: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> {
    fetchResponsibilities(): Promise<any>;
    fetchTouchstones(): Promise<any>;
    isLoading(): boolean;
}

class ResponsibilityStore extends AbstractStore<State, ResponsibilityStoreInterface> implements State {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: Responsibility;

    currentModellingGroupId: string;
    currentDiseaseId: string;

    ready: boolean;

    constructor() {
        super();
        this.registerAsync(sources.responsibilities);
        this.registerAsync(sources.touchstones);
        this.bindListeners({
            handleBeginTouchstoneFetch: touchstoneActions.beginFetch,
            handleUpdateTouchstones: touchstoneActions.update,
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,

            handleSetCurrentResponsibility: responsibilityActions.setCurrentResponsibility,
            handleBeginResponsibilityFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.update,

            handleFilterByDisease: responsibilityActions.filterByDisease,
            handleLogIn: authActions.logIn
        });
    }

    initialState(): State {
        return {
            touchstones: [],
            currentTouchstone: null,

            responsibilitySet: null,
            currentResponsibility: null,

            currentModellingGroupId: null,
            currentDiseaseId: null,

            ready: false
        };
    }

    handleSetCurrentResponsibility(scenarioId: string) {
        this.currentResponsibility = this.responsibilitySet.responsibilities.find(x => x.scenario.id == scenarioId);
    }
    handleSetCurrentTouchstone(touchstoneId: string) {
        this.currentTouchstone = this.touchstones.find(x => x.id == touchstoneId);
    }

    handleBeginTouchstoneFetch() {
        this.touchstones = [];
        this.responsibilitySet = null;
        this.ready = false;
    }
    handleBeginResponsibilityFetch() {
        this.responsibilitySet = null;
        this.ready = false;
        this.currentDiseaseId = null;
    }

    handleUpdateResponsibilities(responsibilities: Responsibilities) {
        const touchstone = this.touchstones.find(x => x.id == responsibilities.touchstone);
        this.responsibilitySet = new ExtendedResponsibilitySet(responsibilities, touchstone);
        this.ready = true;
    }
    handleUpdateTouchstones(touchstones: Array<Touchstone>) {
        this.touchstones = touchstones;
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