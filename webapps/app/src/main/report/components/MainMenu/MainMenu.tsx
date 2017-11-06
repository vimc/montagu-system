import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {ReportList} from "../Reports/ReportList";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends ReportingPageWithHeader<undefined> {
    load() {
        reportStore.fetchReports().catch(doNothing).then(() => {
            super.load();
        });
    }

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

    renderPageContent() {
        return <ReportList />;
    }
}