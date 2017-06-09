import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { loginForm } from "../../shared/components/Login/LoginForm";
import { LoginFormComponent } from "../../shared/components/Login/LoginFormComponent";
import { adminAuthStore } from "../stores/AdminAuthStore";

const LoginForm = FormConnector(loginForm(adminAuthStore))(LoginFormComponent);

export class AdminLoginPage extends AdminPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Log in</span>;
    }

    renderPageContent(): JSX.Element {
        return <LoginForm />;
    }
}