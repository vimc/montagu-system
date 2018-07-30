import * as React from "react";
import * as logo from "./logo-green.png"
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";

export const ReportingPageHeader: React.SFC<undefined> = () => (
    <PageHeader logo={logo} siteTitle={"Reporting portal"} />
)