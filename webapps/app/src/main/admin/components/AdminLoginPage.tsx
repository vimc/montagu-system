import * as React from "react";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { LoginForm } from "../../shared/components/Login/LoginForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import { Page } from "../../shared/components/PageWithHeader/Page";

export class AdminLoginPage extends AdminPageWithHeader<undefined> {
    name(): string {
        return "Log in";
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    urlFragment(): string {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
    }

    render(): JSX.Element {
        return <Page page={this}>
            <LoginForm />
        </Page>;
    }
}