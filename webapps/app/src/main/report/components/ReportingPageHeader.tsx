import * as React from "react";
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeaderNew";
import * as logo from "./logo-green.png"

export const ReportingPageHeader: React.SFC<undefined> = () => (
    <PageHeader logo={logo} siteTitle={"Reporting portal"} />
)