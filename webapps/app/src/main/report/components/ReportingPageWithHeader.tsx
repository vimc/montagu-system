import * as React from "react";
import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";

export abstract class ReportingPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {

    siteTitle() {
        return "Reporting portal";
    }
}