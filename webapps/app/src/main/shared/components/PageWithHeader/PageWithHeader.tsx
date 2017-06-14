import * as React from "react";
import { Link, Location } from "simple-react-router";

const logo = require("./logo.png");
const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined> {

    abstract title(): JSX.Element;
    abstract siteTitle(): string;
    abstract renderPageContent(): JSX.Element;

    render() {
        return <div>
            <header className={ styles.header }>
                <img src={ logo } height="80" alt="VIMC" />
                <div className={ styles.siteTitle }>
                    <Link href="/">{ this.siteTitle() }</Link>
                </div>
                { this.header() }
            </header>
            { this.postHeader() }
            <article className={ styles.page }>
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