import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const embeddedHtml = require('./html/over80.html');

export class ResponsibilityGuidanceOver80 extends ContribPageWithHeader<undefined> {
    name() {
        return "Over 80";
    }

    urlFragment() {
        return "help/over80/";
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    render() {
        return <Page page={this}>
            <iframe src={embeddedHtml} width="100%" height="5836px" frameBorder="0"></iframe>
        </Page>;
    }
}