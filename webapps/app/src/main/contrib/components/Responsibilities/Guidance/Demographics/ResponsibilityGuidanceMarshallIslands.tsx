import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';

import {ContribPageWithHeader} from "../../../PageWithHeader/ContribPageWithHeader";
import { ChooseGroupPage } from "../../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../../shared/Settings";
import { InternalLink } from "../../../../../shared/components/InternalLink";

const commonStyles = require("../../../../../shared/styles/common.css");

const embeddedHtml = require('./html/marshall.html');

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

    renderPageContent() {
        return <div>
            <iframe src={embeddedHtml} width="100%" height="9270px" frameBorder="0"></iframe>
        </div>;
    }
}