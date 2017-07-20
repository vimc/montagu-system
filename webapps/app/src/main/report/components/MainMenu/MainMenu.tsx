import * as React from "react";
import { ReportingPageWithHeader } from "../ReportingPageWithHeader";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends ReportingPageWithHeader<undefined> {
    title() {
        return <span>Main menu</span>;
    }

    renderPageContent() {
        return <div>
        </div>;
    }
}