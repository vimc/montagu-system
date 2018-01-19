import * as React from "react";
import { AdminPageWithHeader } from "../AdminPageWithHeader";
import { ButtonLink } from "../../../shared/components/ButtonLink";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import { Page } from "../../../shared/components/PageWithHeader/Page";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends AdminPageWithHeader<undefined> {
    name(): string {
        return "Main menu";
    }

    urlFragment(): string {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render() :JSX.Element {
        return <Page page={this}>
            <div>
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
            </div>
        </Page>;
    }
}