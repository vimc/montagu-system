import * as React from 'react'
import { Location, Link } from 'simple-react-router';

const logo = require("../resources/logo.png");
const headerStyles = require('../styles/header.css');

export abstract class PageWithHeader<TProps, TState> extends React.Component<PageProperties<TProps>, TState> {
    abstract title(): JSX.Element;

    render() {
        return <div>
            <header className={ headerStyles.header }>
                <img src={ logo } height="80" alt="VIMC" />                
                <div className={ headerStyles.siteTitle }>
                    <Link href="/">Contribution portal</Link>
                </div>
            </header>
            <article className={ headerStyles.content }>
                <div className={ headerStyles.pageTitle }>{ this.title() }</div>            
                { this.renderPageContent() }
            </article>
        </div>
    }

    abstract renderPageContent(): JSX.Element;
}

export interface PageProperties<T> {
    location: Location<T>;
}