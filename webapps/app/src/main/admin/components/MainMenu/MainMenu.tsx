import * as React from "react";
import { AdminPageWithHeader } from "../AdminPageWithHeader";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends AdminPageWithHeader<undefined> {
    title() {
        return <span>Main menu</span>;
    }

    renderPageContent() {
        return <div>
            Please select which area of Montagu you would like to manage:
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