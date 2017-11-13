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
            handleNavigate: navActions.navigate
        });
    }

    initialState(): NavState {
        return initialState();
    }

    handleInitialize(breadcrumbs: Breadcrumb[]) {
        this.isInitialized = true;
        this.crumbs = breadcrumbs;
    }

    handleNavigate(breadcrumb: Breadcrumb) {
        const i = this.crumbs.findIndex(c => c.url == breadcrumb.url);
        if (i >= 0) {
            this.crumbs.splice(i + 1);
        } else {
            this.crumbs.push(breadcrumb);
        }
    }
}

export const navStore =
    alt.createStore<NavState>(NavStore as StoreModel<NavState>) as AltJS.AltStore<NavState>;
