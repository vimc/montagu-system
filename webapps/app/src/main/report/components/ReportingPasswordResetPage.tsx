import * as React from "react";
import { FormConnector } from "alt-reform";
import { PasswordResetFormComponent } from "../../shared/components/Login/PasswordResetFormComponent";
import { passwordResetForm } from "../../shared/components/Login/PasswordResetForm";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";

const PasswordResetForm = FormConnector(passwordResetForm("report"))(PasswordResetFormComponent);

export class ReportingPasswordResetPage extends ReportingPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <PasswordResetForm />;
    }
}