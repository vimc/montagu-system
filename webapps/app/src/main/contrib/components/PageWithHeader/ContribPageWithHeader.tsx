import * as React from "react";
import { ContribLogout } from "../Login/Logout";
import { PageWithHeader } from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class ContribPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <ContribLogout />;
    }

    siteTitle() {
        return "Contribution portal";
    }
}