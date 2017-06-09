import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { Disease, ModellingGroup } from "../models/Generated";
import { settings } from "../Settings";
import { emptyLookup, getFromLookup, ILoadable, makeLookup } from "./Loadable";
import { diseaseActions } from "../actions/DiseaseActions";
import { errorActions } from "../actions/ErrorActions";
import { RemoteContent } from "./RemoteContent";
import { sources } from "../sources/Sources";
import { responsibilityStore } from "./ResponsibilityStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";

export interface MainState extends RemoteContent {
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;
    errors: string[];
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
        errors: [],
        ready: false
    };
}

class MainStore extends AbstractStore<MainState, Interface> {
    ready: boolean;
    errors: string[];
    diseases: ILoadable<Disease>;
    modellingGroups: ILoadable<ModellingGroup>;

    constructor() {
        super();
        this.bindListeners({
            handleDiseases: diseaseActions.update,
            handleModellingGroups: modellingGroupActions.update,
            handleError: errorActions.error,
            handleLogIn: authActions.logIn
        });
        this.registerAsync(sources.diseases);
        this.registerAsync(sources.modellingGroups);
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

    handleError(error: string | Error) {
        if (error instanceof Error) {
            error = error.message;
        }
        this.errors = [error, ...this.errors];
    }

    handleLogIn(props: LogInProperties) {
        if (!props.isAccountActive || !props.isModeller) {
            let reason: string;
            if (!props.isAccountActive) {
                reason = "Your account has been deactivated";
            } else {
                reason = "Only members of modelling groups can log into the contribution portal";
            }

            const support = settings.supportContact;
            this.errors = [`${reason}. Please contact ${support} for help.`, ...this.errors];
        }
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