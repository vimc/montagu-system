import * as React from "react";
import {PageHeader} from "../../shared/components/PageWithHeader/PageHeaderNew";

import * as logo from "../../shared/components/PageWithHeader/logo.png"

export const AdminPageHeader: React.SFC<undefined> = () => (
    <PageHeader siteTitle={"Admin portal"} logo={logo} />
)