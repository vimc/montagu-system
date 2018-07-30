import {History, Location} from "history";
import {match, Router} from "react-router";

export interface PageBreadcrumb {
    name: string;
    urlFragment: string;
    parent?: PageBreadcrumb;
}

export interface PageProperties<T> {
    location: Location;
    router: Router;
    match: match<T>;
    history: History;
    createBreadcrumbs?: (pageBreadcrumb: PageBreadcrumb) => any;
    onLoad?: (props?: T) => any;
}