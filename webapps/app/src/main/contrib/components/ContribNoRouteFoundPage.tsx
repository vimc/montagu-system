import * as React from "react";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {ChooseGroupPage} from "./ChooseGroup/ChooseGroupPage";

export class ContribNoRouteFoundPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return NoRouteFound.title();
    }

    urlFragment(): string {
        return null;
    }

    url(): string {
        return null;
    }

    parent(): IPageWithParent {
        return new ChooseGroupPage();
    }

    renderPageContent(): JSX.Element {
        return NoRouteFound.renderPageContent();
    }
}