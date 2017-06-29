import alt from "../../shared/alt";
import * as AltJS from "alt";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { ModellingGroup, Responsibilities, ScenarioTouchstoneAndCoverageSets, Touchstone } from "../../shared/models/Generated";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { ExtendedResponsibility, ExtendedResponsibilitySet } from "../models/ResponsibilitySet";
import { coverageSetActions } from "../actions/CoverageSetActions";
import { coverageTokenActions } from "../actions/CoverageActions";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { contribAuthStore } from "./ContribAuthStore";
import { ResponsibilitySource } from "../sources/ResponsibilitySource";
import { TouchstoneSource } from "../sources/TouchstoneSource";
import { CoverageSetSource } from "../sources/CoverageSetSource";
import { CoverageTokenSource } from "../sources/CoverageTokenSource";
import { mainStore } from "./MainStore";
import StoreModel = AltJS.StoreModel;

export interface ResponsibilityState extends RemoteContent {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;
    coverageOneTimeToken: string;

    currentModellingGroup: ModellingGroup;
    currentDiseaseId: string;
}

interface ResponsibilityStoreInterface extends AltJS.AltStore<ResponsibilityState> {
    fetchResponsibilities(): Promise<Responsibilities>;
    fetchTouchstones(): Promise<Touchstone[]>;
    fetchCoverageSets(): Promise<ScenarioTouchstoneAndCoverageSets>;
    fetchOneTimeCoverageToken(): Promise<string>;
    isLoading(): boolean;
}

class ResponsibilityStore extends AbstractStore<ResponsibilityState, ResponsibilityStoreInterface> implements ResponsibilityState {
    touchstones: Array<Touchstone>;
    currentTouchstone: Touchstone;

    responsibilitySet: ExtendedResponsibilitySet;
    currentResponsibility: ExtendedResponsibility;
    coverageOneTimeToken: string;

    currentModellingGroup: ModellingGroup;
    currentDiseaseId: string;

    ready: boolean;

    constructor() {
        super();
        this.registerAsync(new ResponsibilitySource());
        this.registerAsync(new TouchstoneSource());
        this.registerAsync(new CoverageSetSource());
        this.registerAsync(new CoverageTokenSource());

        this.bindListeners({
            handleSetCurrentModellingGroup: modellingGroupActions.setCurrentModellingGroup,
            handleUpdateModellingGroups: modellingGroupActions.update,

            handleBeginTouchstoneFetch: touchstoneActions.beginFetch,
            handleUpdateTouchstones: touchstoneActions.update,
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,

            handleSetCurrentResponsibility: responsibilityActions.setCurrentResponsibility,
            handleBeginResponsibilityFetch: responsibilityActions.beginFetch,
            handleUpdateResponsibilities: responsibilityActions.update,

            handleBeginFetchCoverageSets: coverageSetActions.beginFetch,
            handleUpdateCoverageSets: coverageSetActions.update,

            handleUpdateCoverageToken: coverageTokenActions.update,
            handleClearUsedToken: coverageTokenActions.clearUsedToken,

            handleFilterByDisease: responsibilityActions.filterByDisease
        });
    }

    initialState(): ResponsibilityState {
        return {
            touchstones: [],
            currentTouchstone: null,

            responsibilitySet: null,
            currentResponsibility: null,

            currentModellingGroup: null,
            currentDiseaseId: null,
            coverageOneTimeToken: null,

            ready: false
        };
    }

    handleSetCurrentResponsibility(scenarioId: string) {
        if (this.responsibilitySet != null) {
            this.currentResponsibility = this.responsibilitySet.getResponsibilityByScenario(scenarioId);
        }
    }
    handleSetCurrentTouchstone(touchstoneId: string) {
        this.currentTouchstone = this.touchstones.find(x => x.id == touchstoneId);
    }
    handleSetCurrentModellingGroup(modellingGroupId: string) {
        this.currentModellingGroup = mainStore.getGroupById(modellingGroupId);
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
    handleClearUsedToken() {
        this.coverageOneTimeToken = null;
    }

    handleUpdateModellingGroups(groups: ModellingGroup[]) {
        this.waitFor(contribAuthStore);
        const membership = contribAuthStore.getState().modellingGroups;
        if (membership.length == 1) {
            this.currentModellingGroup = groups.find(g => g.id == membership[0].id);
        }
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
    handleUpdateCoverageToken(url: string) {
        this.coverageOneTimeToken = url;
    }

    handleFilterByDisease(diseaseId: string) {
        this.currentDiseaseId = diseaseId;
    }
}

export const responsibilityStore =
    <ResponsibilityStoreInterface>alt.createStore<ResponsibilityState>(ResponsibilityStore as StoreModel<ResponsibilityState>);