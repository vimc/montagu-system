import * as React from "react";
import { Link, Location } from "simple-react-router";
import { Logout } from "../Login/Logout";

const logo = require("./logo.png");
const styles = require('./PageWithHeader.css');

export abstract class PageWithHeader<TLocationProps>
    extends React.Component<PageProperties<TLocationProps>, undefined> {

    abstract title(): JSX.Element;
    abstract renderPageContent(): JSX.Element;

    render() {
        return <div>
            <header className={ styles.header }>
                <img src={ logo } height="80" alt="VIMC" />
                <div className={ styles.siteTitle }>
                    <Link href="/">Contribution portal</Link>
                </div>
                <Logout />
            </header>
            <article className={ styles.page }>
                <div className={ styles.pageTitle }>{ this.title() }</div>
                <div className={ styles.pageContent }>{ this.renderPageContent() }</div>
            </article>
        </div>
    }
}

export interface PageProperties<T> {
    location: Location<T>;
}