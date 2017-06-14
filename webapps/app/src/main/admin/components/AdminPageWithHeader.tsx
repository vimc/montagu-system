import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";

export abstract class AdminPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <Logout />;
    }

    siteTitle() {
        return "Admin portal";
    }
}