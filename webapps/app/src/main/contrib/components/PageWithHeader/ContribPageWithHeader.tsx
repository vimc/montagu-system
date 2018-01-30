import * as React from "react";
import { PageWithHeader } from "../../../shared/components/PageWithHeader/PageWithHeader";

export abstract class ContribPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    siteTitle() {
        return "Modellers' contribution portal";
    }
}