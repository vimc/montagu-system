import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const embeddedHtml = require('./html/childmortality.html');

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

    render() {
        return <Page page={this}>
            <iframe src={embeddedHtml} width="100%" height="2008px" frameBorder="0"></iframe>
        </Page>;
    }
}