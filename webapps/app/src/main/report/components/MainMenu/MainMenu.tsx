import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {ReportList} from "../Reports/ReportList";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ReportingPage} from "../ReportingPage";

export class MainMenu extends ReportingPageWithHeader<undefined> {

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

    render() :JSX.Element {
        return <ReportingPage page={this}>
            <ReportList />
        </ReportingPage>;
    }
}