import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const embeddedHtml = require('./html/tuvalu.html');

export class ResponsibilityGuidanceTuvalu extends ContribPageWithHeader<undefined> {
    name() {
        return "Tuvalu";
    }

    urlFragment() {
        return "help/tuvalu/";
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    render() {
        return <Page page={this}>
            <iframe src={embeddedHtml} width="100%" height="13290px" frameBorder="0"></iframe>
        </Page>;
    }
}