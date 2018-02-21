import * as React from "react";
import {IRouter, Location} from "simple-react-router";

import { navActions } from "../../actions/NavActions";
import {IPageWithParent} from "../../models/Breadcrumb";

export interface PageParts {
    siteTitle(): string;
    title(): JSX.Element;
    hideTitle(): boolean;
    children?: JSX.Element;
}

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined>
    implements IPageWithParent, PageParts {

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
    componentDidMount(): Promise<any> | void {
        return this.loadOnMount();
    }

    loadOnMount(): Promise<any> {
        return this.load(this.props.location.params).then(() => {
            this.createBreadcrumb();
            window.scrollTo(0, 0);
        });
    }

    load(props: TLocationProps): Promise<any> {
        return Promise.resolve(true);
    }
    loadParent(props: TLocationProps): Promise<any> {
        const parent = this.parent();
        if (parent) {
            return this.parent().load(props);
        } else {
            return Promise.resolve(true);
        }
    }

    createBreadcrumb() {
        if (this.includeInBreadcrumbs()) {
            navActions.initialize(this);
        }
    }

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
    onLoad?: (props:T) => void;
}