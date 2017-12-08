import { AbstractStore } from "./AbstractStore";
import alt from "../alt";
import StoreModel = AltJS.StoreModel;
import { navActions } from "../actions/NavActions";
import {Breadcrumb} from "../models/Breadcrumb";

export interface NavState {
    crumbs: Breadcrumb[];
}

function initialState(): NavState {
    return {
        crumbs: []
    };
}

class NavStore extends AbstractStore<NavState, AltJS.AltStore<NavState>> {
    crumbs: Breadcrumb[];

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
        this.crumbs = breadcrumbs;
    }
}

export const navStore =
    alt.createStore<NavState>(NavStore as StoreModel<NavState>) as AltJS.AltStore<NavState>;
