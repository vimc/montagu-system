import alt from "../alt";
import * as AltJS from "alt";
import { RemoteContent } from "./RemoteContent";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import { AbstractStore } from "./AbstractStore";
import { Responsibilities, Responsibility, ScenarioTouchstoneAndCoverageSets, Touchstone } from "../models/Generated";
import { sources } from "../sources/Sources";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { touchstoneActions } from "../actions/TouchstoneActions";
import {
    ExtendedResponsibility, ExtendedResponsibilitySet,
    IExtendedResponsibilitySet
} from "../models/ResponsibilitySet";

export interface State extends RemoteContent {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;

    currentModellingGroupId: string;
    currentDiseaseId: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<State> {
    fetchResponsibilities(): Promise<any>;
    fetchTouchstones(): Promise<any>;
    fetchCoverageSets(): Promise<any>;
    isLoading(): boolean;
}

class ResponsibilityStore extends AbstractStore<State, ResponsibilityStoreInterface> implements State {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;

    currentModellingGroupId: string;
    currentDiseaseId: string;

    ready: boolean;

    constructor() {
        super();
        this.registerAsync(sources.responsibilities);
        this.registerAsync(sources.touchstones);
        this.registerAsync(sources.coverageSets);

        this.bindListeners({
            handleBeginTouchstoneFetch: touchstoneActions.beginFetch,
            handleUpdateTouchstones: touchstoneActions.update,
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,

            handleSetCurrentResponsibility: responsibilityActions.setCurrentResponsibility,
            handleBeginResponsibilityFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.update,

            handleBeginFetchCoverageSets: responsibilityActions.beginFetchCoverageSets,
            handleUpdateCoverageSets: responsibilityActions.updateCoverageSets,

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
        if (this.responsibilitySet != null) {
            console.log(JSON.stringify(this.responsibilitySet));
            this.currentResponsibility = this.responsibilitySet.getResponsibilityByScenario(scenarioId);
        }
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
    handleBeginFetchCoverageSets() {
        this.ready = false;
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
    handleUpdateCoverageSets(data: ScenarioTouchstoneAndCoverageSets) {
        this.responsibilitySet.addCoverageSets(data.scenario.id, data.coverage_sets);
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