import alt from "../../shared/alt";
import * as AltJS from "alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { Disease, ModellingGroup } from "../../shared/models/Generated";
import { emptyLoadable, getFromLoadable, ILoadable, makeLoadable } from "./Loadable";
import { diseaseActions } from "../actions/DiseaseActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { responsibilityStore } from "./ResponsibilityStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { DiseaseSource } from "../sources/DiseaseSource";
import { ModellingGroupSource } from "../sources/ModellingGroupSource";
import { doNothing } from "../../shared/Helpers";

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

export function initialMainState(): MainState {
    return {
        diseases: emptyLoadable<Disease>(),
        modellingGroups: emptyLoadable<ModellingGroup>(),
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
            getDiseaseById: id => getFromLoadable(this.diseases, id),
            getGroupById: id => getFromLoadable(this.modellingGroups, id),
            load: () => {
                this.getInstance().fetchDiseases().catch(doNothing);
                this.getInstance().fetchModellingGroups().catch(doNothing);
            }
        })
    }

    initialState(): MainState {
        return initialMainState();
    }

    handleDiseases(diseases: Array<Disease>) {
        this.diseases = makeLoadable(diseases);
        this.checkReadiness();
    }

    handleModellingGroups(groups: Array<ModellingGroup>) {
        this.modellingGroups = makeLoadable(groups);
        this.checkReadiness();
    }

    checkReadiness(): void {
        const ready = this.diseases.loaded
            && this.modellingGroups.loaded;
        if (!this.ready && ready) {
            this.ready = true;
        }
    }
}

export const mainStore = alt.createStore<MainState>(MainStore) as Interface;