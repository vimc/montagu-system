import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const iframeSrc = "/contribution/guidance/over80.html";

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

    render() :JSX.Element {
        return <Page page={this}>
            <iframe src={iframeSrc} width="100%" height="5836px" frameBorder="0"></iframe>
        </Page>;
    }
}