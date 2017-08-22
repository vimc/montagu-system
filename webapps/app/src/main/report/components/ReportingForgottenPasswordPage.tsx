import * as React from "react";
import { FormConnector } from "alt-reform";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import { ForgottenPasswordFormComponent } from "../../shared/components/Login/ForgottenPasswordForm";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("report"))(ForgottenPasswordFormComponent);

export class ReportingForgottenPasswordPage extends ReportingPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <ForgottenPasswordForm />;
    }
}