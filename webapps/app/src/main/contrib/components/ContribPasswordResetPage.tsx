import * as React from "react";
import { FormConnector } from "alt-reform";
import { PasswordResetFormComponent } from "../../shared/components/Login/PasswordResetFormComponent";
import { passwordResetForm } from "../../shared/components/Login/PasswordResetForm";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";

const PasswordResetForm = FormConnector(passwordResetForm("contrib"))(PasswordResetFormComponent);

export class ContribPasswordResetPage extends ContribPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Forgotten your password?</span>;
    }

    renderPageContent(): JSX.Element {
        return <PasswordResetForm />;
    }
}