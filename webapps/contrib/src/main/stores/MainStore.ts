import alt from "../alt";
import * as AltJS from "alt";
import { RemoteContent } from "./RemoteContent";
import { AbstractStore } from "./AbstractStore";
import { mainActions } from "../actions/MainActions";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { authActions } from "../actions/AuthActions";
import { Disease } from "../Models";
import { settings } from "../Settings";
import { Loadable } from "./Loadable";

export interface State extends RemoteContent {
    diseases: Loadable<Disease>;
}

interface MainStoreInterface extends AltJS.AltStore<State> {
    getDiseaseById(id: string): Disease;
}

function onReady() {
    const action: any = touchstoneActions.fetch;
    action.defer();
}

export function makeDiseaseLookup(diseases: Disease[]): Loadable<Disease> {
    let lookup: { [index: string]: Disease } = {};
    diseases.forEach(d => lookup[ d.id ] = d);

    return {
        content: lookup,
        loaded: true
    };
}

export function initialState(): State {
    return {
        diseases: { content: null, loaded: false },
        errorMessage: null,
        ready: false
    };
}


class MainStore extends AbstractStore<State> {
    ready: boolean;
    errorMessage: string;
    diseases: Loadable<Disease>;

    constructor() {
        super();
        this.bindListeners({
            handleDiseases: mainActions.receiveDiseases,
            handleFetchFailed: mainActions.fetchFailed,
            handleLogIn: authActions.logInAllowed,
            handleLogInForbidden: authActions.logInForbidden,
        });
        this.exportPublicMethods({
            getDiseaseById: id => this.diseases.content[ id ]
        })
    }

    initialState(): State {
        return initialState();
    }

    handleDiseases(diseases: Array<Disease>) {
        this.diseases = makeDiseaseLookup(diseases);
        if (this.diseases.loaded) {
            this.ready = true;
            onReady();
        }
    }

    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    handleLogIn(token: string) {
        (mainActions.fetch as any).defer({});
    }

    handleLogInForbidden(reason: string) {
        const support = settings.supportContact;
        this.errorMessage = `${reason}. Please contact ${support} for help.`;
    }
}

export const Store = alt.createStore<State>(MainStore) as MainStoreInterface;