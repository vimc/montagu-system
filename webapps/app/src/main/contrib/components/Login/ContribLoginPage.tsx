import * as React from "react";
import { FormConnector } from "alt-reform";
import { loginForm } from "../../../shared/components/Login/LoginForm";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { LoginFormComponent } from "../../../shared/components/Login/LoginFormComponent";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import { Page } from "../../../shared/components/PageWithHeader/Page";

const LoginForm = FormConnector(loginForm("contrib", contribAuthStore))(LoginFormComponent);

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