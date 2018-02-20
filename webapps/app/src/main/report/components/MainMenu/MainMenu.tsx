import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {ReportList} from "../Reports/ReportList";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";

import {PageNoHeader} from "../../../shared/components/PageWithHeader/PageNoHeader";

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
        return <PageNoHeader page={this}>
            <ReportList />
        </PageNoHeader>;
    }
}