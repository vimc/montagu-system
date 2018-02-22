import * as React from "react";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import { Page } from "../../shared/components/PageWithHeader/Page";

export class ReportingNoRouteFoundPage extends ReportingPageWithHeader<undefined> {
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
        return new ReportsListPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            {NoRouteFound.render()}
        </Page>;
    }
}