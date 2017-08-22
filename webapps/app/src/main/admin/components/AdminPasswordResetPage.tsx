import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { PasswordResetFormComponent } from "../../shared/components/Login/PasswordResetFormComponent";
import { passwordResetForm } from "../../shared/components/Login/PasswordResetForm";

const PasswordResetForm = FormConnector(passwordResetForm("admin"))(PasswordResetFormComponent);

export class AdminPasswordResetPage extends AdminPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <PasswordResetForm />;
    }
}