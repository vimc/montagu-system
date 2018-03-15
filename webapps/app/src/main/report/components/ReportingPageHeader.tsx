import * as React from "react";
import {PageHeaderNew} from "../../shared/components/PageWithHeader/PageHeaderNew";
import * as logo from "./logo-green.png"

export class ReportingPageHeader extends React.Component {

    render() {
        return <PageHeaderNew logo={logo} siteTitle={"Reporting portal"} />
    }
}