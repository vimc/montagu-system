
import {Breadcrumb} from "../models/Breadcrumb";
import {PageBreadcrumb} from "../components/PageWithHeader/PageWithHeader";

export const breadcrumbsModule = {

    getParentsInOrderFromTopToBottom(page: any, props:any): any {
        let parents: any[] = [];
        while (page != null) {
            parents.unshift(page); // adds at the beginning
            page = page.parent ? page.parent(props) : null;
        }
        return parents;
    },

    initialize(pageBreadcrumb: () => PageBreadcrumb, props: any, state: any): Breadcrumb[] {
        if (pageBreadcrumb != null) {
            const parents = this.getParentsInOrderFromTopToBottom(pageBreadcrumb(props), props);
            return parents.map((p: any) => ({
                url: this.url(p, props),
                name: p.name
            }));
        } else {
            return [];
        }
    },

    url(page: any, props: any): string {
        let url = page.urlFragment;
        if (url === undefined) {
            return undefined;
        }
        let p = page.parent ? page.parent(props) : null;
        while (p != null) {
            const fragment = p.urlFragment;
            if (fragment === undefined) {
                return undefined;
            }
            url = fragment + url;
            p = p.parent ? p.parent(props) : null;
        }
        return url;
    }
};