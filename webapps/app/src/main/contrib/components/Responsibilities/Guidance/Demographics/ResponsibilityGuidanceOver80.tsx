import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../../shared/Settings";
import { InternalLink } from "../../../../../shared/components/InternalLink";

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

    renderPageContent() {
        return <div>
            <iframe src={embeddedHtml} width="100%" height="5836px" frameBorder="0"></iframe>
        </div>;
    }
}