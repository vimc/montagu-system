import * as React from "react";
import { FormConnector } from "alt-reform";
import { loginForm } from "../../../shared/components/Login/LoginForm";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { LoginFormComponent } from "../../../shared/components/Login/LoginFormComponent";
import { ContribPageWithHeader } from "../PageWithHeader/ContribPageWithHeader";

const LoginForm = FormConnector(loginForm("contrib", contribAuthStore))(LoginFormComponent);

export class ContribLoginPage extends ContribPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Log in</span>;
    }

    renderPageContent(): JSX.Element {
        return <LoginForm />;
    }
}