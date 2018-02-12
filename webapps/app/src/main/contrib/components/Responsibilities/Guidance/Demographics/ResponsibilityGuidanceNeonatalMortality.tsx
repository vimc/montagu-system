import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const iframeSrc = "/contribution/guidance/child-mortality.html";

export class ResponsibilityGuidanceNeonatalMortality extends ContribPageWithHeader<undefined> {
    name() {
        return "Child Mortality";
    }

    urlFragment() {
        return "help/neonatal-mortality/";
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    render() :JSX.Element {
        return <Page page={this}>
            <iframe src={iframeSrc} width="100%" height="2008px" frameBorder="0"></iframe>
        </Page>;
    }
}