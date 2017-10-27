import alt from "../alt";
import { AbstractActions } from "./AbstractActions";
import {Breadcrumb} from "../models/Breadcrumb";

interface Actions {
    navigate(url: string, name: string): Breadcrumb;
    pop(): Boolean;
}

class NavActions extends AbstractActions implements Actions {
    navigate(url: string, name: string): Breadcrumb {
        return { url, name };
    }

    pop(): Boolean {
        return true;
    }
}

export const navActions = alt.createActions<Actions>(NavActions);
