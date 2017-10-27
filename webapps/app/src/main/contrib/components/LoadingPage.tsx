import * as React from "react";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";

const spinner = require("../../shared/components/RemoteContentComponent/spinner.gif");

export class LoadingPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return "Loading...";
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    renderPageContent(): JSX.Element {
        return <img src={ spinner } />;
    }
}