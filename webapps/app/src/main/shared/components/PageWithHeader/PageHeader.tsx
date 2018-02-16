import * as React from "react";
import { InternalLink } from "../InternalLink";
import {NavBar} from "../NavBar/NavBar";
import { LoggedInUserBox } from "../Login/LoggedInUserBox";

import * as logo from "./logo.png";

interface HeaderProps {
    siteTitle: string;
}

export class PageHeader extends React.Component<HeaderProps, undefined> {

    render() {
        return <div>
            <header className="header">
                <a href="/"><img src={logo} height="80" alt="VIMC"/></a>
                <div className="header__siteTitle">
                    <InternalLink href="/">{this.props.siteTitle}</InternalLink>
                </div>
                <LoggedInUserBox />
            </header>
            <NavBar />
        </div>

    }
}