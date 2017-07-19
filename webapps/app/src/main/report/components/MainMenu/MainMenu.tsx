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
            All reports:
            <ol className={ menuStyles.menu }>
                <li>
                    <ButtonLink href="/modelling-groups/">Modelling groups</ButtonLink>
                </li>
                <li>
                    <ButtonLink href="/touchstones/">Touchstones</ButtonLink>
                </li>
                <li>
                    <ButtonLink href="/users/">Users and permissions</ButtonLink>
                </li>
            </ol>
        </div>;
    }
}