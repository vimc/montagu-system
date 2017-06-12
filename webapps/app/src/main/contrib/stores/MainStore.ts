import alt from "../../shared/alt";
import * as AltJS from "alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { Disease, ModellingGroup } from "../models/Generated";
import { emptyLookup, getFromLookup, ILoadable, makeLookup } from "./Loadable";
import { diseaseActions } from "../actions/DiseaseActions";
import { RemoteContent } from "./RemoteContent";
import { responsibilityStore } from "./ResponsibilityStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { DiseaseSource } from "../sources/DiseaseSource";
import { ModellingGroupSource } from "../sources/ModellingGroupSource";

export interface MainState extends RemoteContent {
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;
}

interface Interface extends AltJS.AltStore<MainState> {
    load(): void;

    getDiseaseById(id: string): Disease;
    getGroupById(id: string): ModellingGroup;

    fetchDiseases(): Promise<Disease[]>;
    fetchModellingGroups(): Promise<ModellingGroup[]>;

    isLoading(): boolean;
}

function onReady() {
    setTimeout(() => responsibilityStore.fetchTouchstones());
}

export function initialMainState(): MainState {
    return {
        diseases: emptyLookup<Disease>(),
        modellingGroups: emptyLookup<ModellingGroup>(),
        ready: false
    };
}

class MainStore extends AbstractStore<MainState, Interface> {
    ready: boolean;
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;

    constructor() {
        super();
        this.bindListeners({
            handleDiseases: diseaseActions.update,
            handleModellingGroups: modellingGroupActions.update,
        });
        this.registerAsync(new DiseaseSource());
        this.registerAsync(new ModellingGroupSource());
        this.exportPublicMethods({
            getDiseaseById: id => getFromLookup(this.diseases, id),
            getGroupById: id => getFromLookup(this.modellingGroups, id),
            load: () => {
                this.getInstance().fetchDiseases();
                this.getInstance().fetchModellingGroups();
            }
        })
    }

    initialState(): MainState {
        return initialMainState();
    }

    handleDiseases(diseases: Array<Disease>) {
        this.diseases = makeLookup(diseases);
        this.checkReadiness();
    }

    handleModellingGroups(groups: Array<ModellingGroup>) {
        this.modellingGroups = makeLookup(groups);
        this.checkReadiness();
    }

    checkReadiness(): void {
        const ready = this.diseases.loaded
            && this.modellingGroups.loaded;
        if (!this.ready && ready) {
            this.ready = true;
            onReady();
        }
    }
}

export const mainStore = alt.createStore<MainState>(MainStore) as Interface;