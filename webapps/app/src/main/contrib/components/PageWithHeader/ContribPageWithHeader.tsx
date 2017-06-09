import * as React from "react";
import { Logout } from "../Login/Logout";
import { PageWithHeader } from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class ContribPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <Logout />;
    }

    siteTitle() {
        return "Contribution portal";
    }
}