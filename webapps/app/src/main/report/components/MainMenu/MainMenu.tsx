import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {ReportList} from "../ReportList";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends ReportingPageWithHeader<undefined> {
    componentDidMount() {
        setTimeout(() => {
            reportStore.fetchReports().catch(doNothing);
        });
    }

    title() {
        return <span>Main menu</span>;
    }

    renderPageContent() {
        return <ReportList />;
    }
}