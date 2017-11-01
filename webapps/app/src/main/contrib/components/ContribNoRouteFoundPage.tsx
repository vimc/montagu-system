import * as React from "react";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";

export class ContribNoRouteFoundPage extends ContribPageWithHeader<undefined> {
    title(): JSX.Element {
        return NoRouteFound.title();
    }

    renderPageContent(): JSX.Element {
        return NoRouteFound.renderPageContent();
    }
}