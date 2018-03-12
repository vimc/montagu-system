import * as React from "react";
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";
import * as logo from "./logo-green.png"

export class ReportingPageHeader extends React.Component {

    render() {
        return <PageHeader logo={logo} siteTitle={"Reporting portal"} />
    }
}