import * as React from "react";
import { FormConnector } from "alt-reform";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { loginForm } from "../../shared/components/Login/LoginForm";
import { LoginFormComponent } from "../../shared/components/Login/LoginFormComponent";
import { reportingAuthStore } from "../stores/ReportingAuthStore";

const LoginForm = FormConnector(loginForm("reporting", reportingAuthStore))(LoginFormComponent);

export class ReportingLoginPage extends ReportingPageWithHeader<undefined> {
    name(): string {
        return "Log in";
    }

    includeInBreadcrumbs(): boolean {
        return false;
    }

    renderPageContent(): JSX.Element {
        return <LoginForm />;
    }
}