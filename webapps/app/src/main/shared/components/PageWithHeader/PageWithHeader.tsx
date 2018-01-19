import * as React from "react";
import {IRouter, Location} from "simple-react-router";

import { InternalLink } from "../InternalLink";
import { navActions } from "../../actions/NavActions";
import {NavBar} from "../NavBar/NavBar";
import {IPageWithParent} from "../../models/Breadcrumb";

import './PageWithHeader.scss';
import * as logo from "./logo.png";

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined>
    implements IPageWithParent {

    title(): JSX.Element {
        return <span>{this.name()}</span>;
    }
    abstract siteTitle(): string;

    abstract name(): string;
    abstract urlFragment(): string;
    abstract parent(): IPageWithParent;
    includeInBreadcrumbs(): boolean {
        return true;
    }
    hideTitle(): boolean {
        return false;
    }

    load() {
        this.createBreadcrumb();
        window.scrollTo(0, 0);
    }

    createBreadcrumb() {
        if (this.includeInBreadcrumbs()) {
            navActions.initialize(this);
        }
    }

    header(): JSX.Element { return null; }
    postHeader(): JSX.Element { return null; }

    url(): string {
        let url = this.urlFragment();
        if (url === undefined) {
            return undefined;
        }
        let p = this.parent();
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
}

export interface PageProperties<T> {
    location: Location<T>;
    router: IRouter;
}