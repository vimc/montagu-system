import {PageInterface} from "../components/PageWithHeader/PageWithHeader";
import {Breadcrumb} from "../models/Breadcrumb";

export const breadcrumbsModule = {

    getParentsInOrderFromTopToBottom(page: PageInterface): PageInterface[] {
        let parents: PageInterface[] = [];
        while (page != null) {
            parents.unshift(page); // adds at the beginning
            page = page.parent();
        }
        return parents;
    },

    initialize(page: PageInterface): Breadcrumb[] {
        if (page != null) {
            console.log('in1')
            const parents = this.getParentsInOrderFromTopToBottom(page);
            return parents.map((p: PageInterface) => ({
                url: this.url(page),
                name: p.name()
            }));
        } else {
            console.log('in2')
            return [];
        }
    },

    url(page: PageInterface): string {
        let url = page.urlFragment();
        if (url === undefined) {
            return undefined;
        }
        let p = page.parent();
        while (p != null) {
            const fragment = p.urlFragment();
            if (fragment === undefined) {
                return undefined;
            }
            url = fragment + url;
            p = p.parent();
        }
        return url;
    }

};