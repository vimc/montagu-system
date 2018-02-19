import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {ReportList} from "../Reports/ReportList";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import { Page } from "../../../shared/components/PageWithHeader/Page";

import "./MainMenu.scss";

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
        return <Page page={this}>
            <ReportList />
        </Page>;
    }
}