import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("admin"))(ForgottenPasswordFormComponent);

export class AdminForgottenPasswordPage extends AdminPageWithHeader<undefined> {
    name(): string {
        return ForgottenPasswordPageTitle;
    }

    renderPageContent(): JSX.Element {
        return <ForgottenPasswordForm />;
    }
}