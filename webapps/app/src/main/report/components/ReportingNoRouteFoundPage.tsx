import * as React from "react";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { NoRouteFound } from "../../shared/components/NoRouteFound";

export class ReportingNoRouteFoundPage extends ReportingPageWithHeader<undefined> {
    name(): string {
        return NoRouteFound.title();
    }

    renderPageContent(): JSX.Element {
        return NoRouteFound.renderPageContent();
    }
}