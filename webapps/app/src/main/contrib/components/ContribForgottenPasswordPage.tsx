import * as React from "react";
import { FormConnector } from "alt-reform";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";
import { ForgottenPasswordFormComponent } from "../../shared/components/Login/ForgottenPasswordForm";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("contrib"))(ForgottenPasswordFormComponent);

export class ContribForgottenPasswordPage extends ContribPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <ForgottenPasswordForm />;
    }
}