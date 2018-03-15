import * as React from "react";

import { InternalLink } from "../InternalLink";
import {BreadcrumbsBar} from "../Breadcrumbs/Breadcrumbs";
import { LoggedInUserBox } from "../Login/LoggedInUserBox";

interface HeaderProps {
    siteTitle: string;
    logo: any;
}

export const PageHeaderNew: React.SFC<HeaderProps> = (props: HeaderProps) => {
    return <div>
        <header className="header">
            <a href="/"><img src={props.logo} className="pl-md-1 logo" height="75" alt="VIMC"/></a>
            <div className="header__siteTitle">
                <InternalLink href="/">
                    {props.siteTitle}
                </InternalLink>
            </div>
            <LoggedInUserBox />
        </header>
        <BreadcrumbsBar />
    </div>;
}