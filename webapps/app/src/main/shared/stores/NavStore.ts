import { AbstractStore } from "./AbstractStore";
import alt from "../alt";
import StoreModel = AltJS.StoreModel;
import { navActions } from "../actions/NavActions";
import {Breadcrumb} from "../models/Breadcrumb";

export interface NavState {
    crumbs: Breadcrumb[];
}

function initialState(): NavState {
    return { crumbs: [] };
}

class NavStore extends AbstractStore<NavState, AltJS.AltStore<NavState>> {
    crumbs: Breadcrumb[];

    constructor() {
        super();
        this.bindListeners({
            handleNavigate: navActions.navigate,
            handlePop: navActions.pop
        });
    }

    initialState(): NavState {
        return initialState();
    }

    handleNavigate(breadcrumb: Breadcrumb) {
        console.log("Navigated to: " + JSON.stringify(breadcrumb));
        const i = this.crumbs.findIndex(c => c.url == breadcrumb.url);
        if (i >= 0) {
            this.crumbs.splice(i + 1);
        } else {
            this.crumbs.push(breadcrumb);
        }
    }

    handlePop() {
        this.crumbs.pop();
    }
}

export const navStore =
    alt.createStore<NavState>(NavStore as StoreModel<NavState>) as AltJS.AltStore<NavState>;
