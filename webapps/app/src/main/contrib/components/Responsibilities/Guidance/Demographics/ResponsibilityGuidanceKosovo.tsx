import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const embeddedHtml = require('./html/kosovo.html');

export class ResponsibilityGuidanceKosovo extends ContribPageWithHeader<undefined> {
    name() {
        return "Kosovo";
    }

    urlFragment() {
        return "help/kosovo/";
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    render() {
        return <Page page={this}>
            <iframe src={embeddedHtml} width="100%" height="12231px" frameBorder="0"></iframe>
        </Page>;
    }
}