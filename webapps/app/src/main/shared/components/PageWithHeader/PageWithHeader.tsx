import * as React from "react";
import { Location } from "simple-react-router";
import { InternalLink } from "../InternalLink";
import { navActions } from "../../actions/NavActions";
import {NavBar} from "../NavBar/NavBar";

const logo = require("./logo.png");
const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined> {

    abstract name(): string;
    includeInBreadcrumbs(): boolean {
        return true;
    }

    title(): JSX.Element {
        return <span>{this.name()}</span>;
    }
    abstract siteTitle(): string;
    abstract renderPageContent(): JSX.Element;

    componentDidMount() {
        console.log("Mounted " + this.name());
        if (this.includeInBreadcrumbs()) {
            console.log("Fire event");
            setTimeout(() => navActions.navigate(window.location.pathname, this.name()));
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
                <div className={ styles.pageTitle }>{ this.title() }</div>
                <div className={ styles.pageContent }>{ this.renderPageContent() }</div>
            </article>
        </div>
    }

    header(): JSX.Element { return null; }
    postHeader(): JSX.Element { return null; }
}

export interface PageProperties<T> {
    location: Location<T>;
}