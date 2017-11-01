import alt from "../alt";
import { AbstractActions } from "./AbstractActions";
import {Breadcrumb, IPageWithParent} from "../models/Breadcrumb";

interface Actions {
    initialize(page: IPageWithParent): Breadcrumb[];
    navigate(url: string, name: string): Breadcrumb;
}

function getParentsInOrderFromTopToBottom(page: IPageWithParent): IPageWithParent[] {
    let parents: IPageWithParent[] = [];
    let parent = page.parent();
    while (parent != null) {
        parents.unshift(parent); // adds at the beginning
        parent = parent.parent();
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
}

export const navActions = alt.createActions<Actions>(NavActions);
