import * as React from 'react'

const logo = require("../resources/logo.png");
require('../fonts.css');
const headerStyles = require('./Header.css');

export abstract class PageWithHeader<TProps, TState> extends React.Component<TProps, TState> {
    abstract title: String;

	render() {
		return <div>
            <header className={ headerStyles.header }>
            	<img src={ logo } height="80" alt="VIMC" />            	
            	<div className={ headerStyles.siteTitle }>Contribution portal</div>
            </header>
            <div className={ headerStyles.content }>
                <div className={ headerStyles.pageTitle }>{ this.title }</div>            
                { this.renderPageContent() }
            </div>
        </div>
	}

    abstract renderPageContent(): JSX.Element;
}