import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {ReportList} from "../Reports/ReportList";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends ReportingPageWithHeader<undefined> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            reportStore.fetchReports().catch(doNothing);
        });
    }

    name() {
        return "Choose a report to view";
    }

    renderPageContent() {
        return <ReportList />;
    }
}