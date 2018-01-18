import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { loginForm } from "../../shared/components/Login/LoginForm";
import { LoginFormComponent } from "../../shared/components/Login/LoginFormComponent";
import { adminAuthStore } from "../stores/AdminAuthStore";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import { Page } from "../../shared/components/PageWithHeader/Page";

const LoginForm = FormConnector(loginForm("admin", adminAuthStore))(LoginFormComponent);

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