import * as React from "react";
import {PageHeaderNew} from "../../shared/components/PageWithHeader/PageHeaderNew";
import * as logo from "./logo-green.png"

export const ReportingPageHeader: React.SFC<undefined> = () => (
    <PageHeaderNew logo={logo} siteTitle={"Reporting portal"} />
)