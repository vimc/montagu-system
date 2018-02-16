import * as React from "react";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";
import { LoginForm } from "../../../shared/components/Login/LoginForm";

import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import { Page } from "../../../shared/components/PageWithHeader/Page";

export class ContribLoginPage extends ContribPageWithHeader<undefined> {
    name(): string {
        return "Log in";
    }

    urlFragment(): string {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    render(): JSX.Element {
        return <Page page={this}>
            <LoginForm />
        </Page>;
    }
}