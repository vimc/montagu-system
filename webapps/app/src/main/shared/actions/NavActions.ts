import alt from "../alt";
import { AbstractActions } from "./AbstractActions";
import {Breadcrumb, IPageWithParent} from "../models/Breadcrumb";

interface Actions {
    initialize(page: IPageWithParent): Breadcrumb[];
    navigate(url: string, name: string): Breadcrumb;
    pop(): Boolean;
}

function getParentsInOrderFromTopToBottom(page: IPageWithParent): IPageWithParent[] {
    let parents: IPageWithParent[] = [];
    while (page != null) {
        parents.unshift(page); // adds at the beginning
        page = page.parent();
    }
    return parents;
}

class NavActions extends AbstractActions implements Actions {
    initialize(page: IPageWithParent): Breadcrumb[] {
        const parents = getParentsInOrderFromTopToBottom(page);
        return parents.map(p => ({
            url: p.url(),
            name: p.name()
        }));
    }

    navigate(url: string, name: string): Breadcrumb {
        return { url, name };
    }

    pop(): Boolean {
        return true;
    }
}

export const navActions = alt.createActions<Actions>(NavActions);
