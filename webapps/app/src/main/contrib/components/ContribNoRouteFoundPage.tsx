import * as React from "react";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";

export class ContribNoRouteFoundPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return NoRouteFound.title();
    }

    renderPageContent(): JSX.Element {
        return NoRouteFound.renderPageContent();
    }
}