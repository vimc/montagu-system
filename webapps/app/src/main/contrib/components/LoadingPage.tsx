import * as React from "react";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../shared/models/Breadcrumb";

const spinner = require("../../shared/components/RemoteContentComponent/spinner.gif");

export class LoadingPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return "Loading...";
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    urlFragment(): string {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    renderPageContent(): JSX.Element {
        return <img src={ spinner } />;
    }
}