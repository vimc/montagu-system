import alt from '../alt';
import * as AltJS from 'alt';
import { RemoteContent }  from './RemoteContent'
import { AbstractStore } from './AbstractStore';
import { mainActions } from '../actions/MainActions';
import { touchstoneActions } from '../actions/TouchstoneActions';
import { Disease } from '../Models'

export interface State extends RemoteContent {
    diseases: Array<Disease>;
}

interface MainStoreInterface extends AltJS.AltStore<State> { 
    getDiseaseById(id: string): Disease;
}

interface Loadable<T> {
    content: { [index: string] : Disease };
    loaded: boolean;
}

function onReady() {
    const action: any = touchstoneActions.fetch;
    action.defer();
}

class MainStore extends AbstractStore<State> {
    ready: boolean;
    errorMessage: string;
    diseases: Loadable<Array<Disease>>;

    constructor() {
        super();
        this.diseases = { content: null, loaded: false };
        this.errorMessage = null;
        this.ready = false;    
        this.bindListeners({
            handleDiseases: mainActions.receiveDiseases,
            handleFetchFailed: mainActions.fetchFailed
        });
        this.exportPublicMethods({
            getDiseaseById: id => this.diseases.content[id]
        })
    }
    handleDiseases(diseases: Array<Disease>) {
        let lookup: { [index: string] : Disease } = {};
        diseases.forEach(d => lookup[d.id] = d);

        this.diseases = { 
            content: lookup, 
            loaded: true
        };
        if (this.diseases.loaded) {
            this.ready = true;
            onReady();
        }
    }
    handleFetchFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = alt.createStore<State>(MainStore) as MainStoreInterface;