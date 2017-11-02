import * as React from "react";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { NoRouteFound } from "../../shared/components/NoRouteFound";

export class AdminNoRouteFoundPage extends AdminPageWithHeader<undefined> {
    title(): JSX.Element {
        return NoRouteFound.title();
    }

    renderPageContent(): JSX.Element {
        return NoRouteFound.renderPageContent();
    }
}