import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import { ForgottenPasswordFormComponent } from "../../shared/components/Login/ForgottenPasswordForm";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("admin"))(ForgottenPasswordFormComponent);

export class AdminForgottenPasswordPage extends AdminPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <ForgottenPasswordForm />;
    }
}