import * as React from "react";

import { InternalLink } from "../InternalLink";
import {BreadcrumbsBar} from "../Breadcrumbs/Breadcrumbs";
import { LoggedInUserBox } from "../Login/LoggedInUserBox";
import * as logo from "./logo.png"

interface HeaderProps {
    siteTitle: string;
    logo?: any;
}

const defaultProps: Partial<HeaderProps> = {
    logo
}

const PageHeaderNew: React.SFC<HeaderProps> = (props: HeaderProps) => {
    return <div>
        <header className="header">
            <InternalLink href="/">
                <img src={props.logo} className="pl-md-1 logo" height="75" alt="VIMC"/>
            </InternalLink>
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

PageHeaderNew.defaultProps = defaultProps;

export {PageHeaderNew}