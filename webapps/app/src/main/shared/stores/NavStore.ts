import { AbstractStore } from "./AbstractStore";
import alt from "../alt";
import StoreModel = AltJS.StoreModel;
import { navActions } from "../actions/NavActions";
import {Breadcrumb} from "../models/Breadcrumb";

export interface NavState {
    crumbs: Breadcrumb[];
    isInitialized: boolean;
}

function initialState(): NavState {
    return {
        crumbs: [],
        isInitialized: false
    };
}

class NavStore extends AbstractStore<NavState, AltJS.AltStore<NavState>> {
    crumbs: Breadcrumb[];
    isInitialized: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleInitialize: navActions.initialize,
        });
    }

    initialState(): NavState {
        return initialState();
    }

    handleInitialize(breadcrumbs: Breadcrumb[]) {
        this.isInitialized = true;
        this.crumbs = breadcrumbs;
    }
}

export const navStore =
    alt.createStore<NavState>(NavStore as StoreModel<NavState>) as AltJS.AltStore<NavState>;
