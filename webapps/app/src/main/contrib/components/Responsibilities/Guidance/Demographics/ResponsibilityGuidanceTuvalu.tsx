import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../../shared/Settings";
import { InternalLink } from "../../../../../shared/components/InternalLink";

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

    renderPageContent() {
        return <div>
            <iframe src={embeddedHtml} width="100%" height="13290px" frameBorder="0"></iframe>
        </div>;
    }
}