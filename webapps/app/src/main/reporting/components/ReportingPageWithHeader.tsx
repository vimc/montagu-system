import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";
import { ReportingLogout } from "./Login/Logout";

export abstract class ReportingPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    header() {
        return <ReportingLogout />;
    }

    siteTitle() {
        return "Reporting portal";
    }
}