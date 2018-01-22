import * as React from "react";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {MainMenu} from "./MainMenu/MainMenu";
import { Page } from "../../shared/components/PageWithHeader/Page";

export class AdminNoRouteFoundPage extends AdminPageWithHeader<undefined> {
    name(): string {
        return NoRouteFound.title();
    }

    urlFragment(): string {
        return null;
    }

    url(): string {
        return null;
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    render(): JSX.Element {
        return <Page page={this}>
            {NoRouteFound.render()}
        </Page>;
    }
}