import * as React from "react";
import {IRouter, Location} from "simple-react-router";
import { InternalLink } from "../InternalLink";
import { navActions } from "../../actions/NavActions";
import {NavBar} from "../NavBar/NavBar";
import {navStore} from "../../stores/NavStore";
import {IPageWithParent} from "../../models/Breadcrumb";

const logo = require("./logo.png");
const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined>
    implements IPageWithParent {

    title(): JSX.Element {
        return <span>{this.name()}</span>;
    }
    abstract siteTitle(): string;
    abstract renderPageContent(): JSX.Element;

    abstract name(): string;
    abstract urlFragment(): string;
    abstract parent(): IPageWithParent;
    includeInBreadcrumbs(): boolean {
        return true;
    }
    hideTitle(): boolean {
        return false;
    }

    componentDidMount() {
        setTimeout(() => this.load());
    }

    load() {
        this.createBreadcrumb();
    }

    createBreadcrumb() {
        if (this.includeInBreadcrumbs()) {
            if (navStore.getState().isInitialized) {
                navActions.navigate(this.url(), this.name());
            } else {
                navActions.initialize(this);
            }
        }
    }

    render() {
        return <div>
            <header className={ styles.header }>
                <a href="/"><img src={ logo } height="80" alt="VIMC" /></a>
                <div className={ styles.siteTitle }>
                    <InternalLink href="/">{ this.siteTitle() }</InternalLink>
                </div>
                { this.header() }
            </header>
            <NavBar />
            { this.postHeader() }
            <article className={ `${styles.page} container` }>
                { !this.hideTitle() &&
                    <div className={ styles.pageTitle }>{ this.title() }</div>
                }
                <div className={ styles.pageContent }>{ this.renderPageContent() }</div>
            </article>
        </div>
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