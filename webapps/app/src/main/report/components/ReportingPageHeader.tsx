import * as React from "react";
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";

import * as logo from "./logo-purple.png"

interface HeaderProps {
    siteTitle: string;
}

export class ReportingPageHeader extends React.Component<HeaderProps, undefined> {

    render() {
        return <PageHeader logo={logo} siteTitle={"Reporting portal"} />
    }
}