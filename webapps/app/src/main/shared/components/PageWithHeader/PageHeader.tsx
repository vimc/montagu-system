import * as React from "react";
import { InternalLink } from "../InternalLink";
import {NavBar} from "../NavBar/NavBar";
import { LoggedInUserBox } from "../Login/LoggedInUserBox";

interface HeaderProps {
    siteTitle: string;
    logo: any;
}

export class PageHeader extends React.Component<HeaderProps, undefined> {

    render() {
        return <div>
            <header className="header">
                <a href="/"><img src={this.props.logo} className="pl-md-1 logo" height="75" alt="VIMC"/></a>
                <div className="header__siteTitle">
                    <InternalLink href="/">{this.props.siteTitle}</InternalLink>
                </div>
                <LoggedInUserBox />
            </header>
            <NavBar />
        </div>

    }
}