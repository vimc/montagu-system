import * as React from "react";
import * as logo from "../../shared/components/PageWithHeader/logo.png"
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeader";

export const AdminPageHeader: React.SFC<undefined> = () => (
    <PageHeader siteTitle={"Admin portal"} logo={logo} />
)