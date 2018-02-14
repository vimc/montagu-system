import * as React from "react";

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { Page } from "../../../../../shared/components/PageWithHeader/Page";

const iframeSrc = "/contribution/guidance/marshall_demography.html";

export class ResponsibilityGuidanceMarshallIslands extends ContribPageWithHeader<undefined> {
    name() {
        return "Marshall Islands";
    }

    urlFragment() {
        return "help/marshall-islands/";
    }

    hideTitle(): boolean {
        return true;
    }

    parent() {
        return new ChooseGroupPage();
    }

    render() :JSX.Element {
        return <Page page={this}>
            <iframe src={iframeSrc} width="100%" height="9270px" frameBorder="0"></iframe>
        </Page>;
    }
}