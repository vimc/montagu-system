import alt from "../alt";
import * as AltJS from "alt";
import { AbstractStore } from "./AbstractStore";
import { authActions, LogInProperties } from "../actions/AuthActions";
import { Disease } from "../models/Generated";
import { settings } from "../Settings";
import { Loadable } from "./Loadable";
import { diseaseActions } from "../actions/DiseaseActions";
import { errorActions } from "../actions/ErrorActions";
import { RemoteContent } from "./RemoteContent";
import { sources } from "../sources/Sources";
import { responsibilityStore } from "./ResponsibilityStore";

export interface MainState extends RemoteContent {
    diseases: Loadable<Disease>;
    errors: string[];
}

interface Interface extends AltJS.AltStore<MainState> {
    load(): Promise<Disease[]>;
    getDiseaseById(id: string): Disease;
    fetchDiseases(): void;
    isLoading(): boolean;
}

function onReady() {
    setTimeout(() => responsibilityStore.fetchTouchstones());
}

export function makeDiseaseLookup(diseases: Disease[]): Loadable<Disease> {
    let lookup: { [index: string]: Disease } = {};
    diseases.forEach(d => lookup[ d.id ] = d);

    return {
        content: lookup,
        loaded: true
    };
}

export function initialMainState(): MainState {
    return {
        diseases: { content: null, loaded: false },
        errors: [],
        ready: false
    };
}


class MainStore extends AbstractStore<MainState, Interface> {
    ready: boolean;
    errors: string[];
    diseases: Loadable<Disease>;

    constructor() {
        super();
        this.bindListeners({
            handleDiseases: diseaseActions.update,
            handleError: errorActions.error,
            handleLogIn: authActions.logIn
        });
        this.registerAsync(sources.diseases);
        this.exportPublicMethods({
            getDiseaseById: id => this.diseases.content[id],
            load: () => this.getInstance().fetchDiseases()
        })
    }

    initialState(): MainState {
        return initialMainState();
    }

    handleDiseases(diseases: Array<Disease>) {
        this.diseases = makeDiseaseLookup(diseases);
        if (this.diseases.loaded) {
            this.ready = true;
            onReady();
        }
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
}

export const mainStore = alt.createStore<MainState>(MainStore) as Interface;