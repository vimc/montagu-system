import * as React from "react";
import {PageHeaderNew} from "../../shared/components/PageWithHeader/PageHeaderNew";

import * as logo from "../../shared/components/PageWithHeader/logo.png"

export const AdminPageHeader: React.SFC<undefined> = () => (
    <PageHeaderNew siteTitle={"Admin portal"} logo={logo} />
)