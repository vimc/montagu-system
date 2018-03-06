import * as React from "react";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ReportingPage} from "../ReportingPage";

export class ReportsListPage extends ReportingPageWithHeader<undefined> {

    name() {
        return "Main menu";
    }

    title() {
        return <span>Choose a report to view</span>;
    }

    urlFragment() {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render(): JSX.Element {
        return <ReportingPage page={this}>
            <ReportsListFilter/>
            <ReportsListSorting/>
            <ReportsList/>
        </ReportingPage>;
    }
}