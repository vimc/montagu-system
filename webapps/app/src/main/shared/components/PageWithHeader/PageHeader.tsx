import * as React from "react";
import { InternalLink } from "../InternalLink";
import {NavBar} from "../NavBar/NavBar";

import * as logo from "./logo.png";

interface HeaderProps {
    siteTitle: string;
    header: JSX.Element;
    postHeader: JSX.Element;
}

export class PageHeader extends React.Component<HeaderProps, undefined> {

    render() {
        return <div>
            <header className="header">
                <a href="/"><img src={logo} height="80" alt="VIMC"/></a>
                <div className="header__siteTitle">
                    <InternalLink href="/">{this.props.siteTitle}</InternalLink>
                </div>
                {this.props.header}
            </header>
            <NavBar />
            {this.props.postHeader}
        </div>

    }
}