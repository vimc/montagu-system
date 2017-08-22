import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { ResetPasswordFormComponent } from "./ResetPasswordForm";
import { FormConnector } from "alt-reform";
import { resetPasswordFormStore } from "./ResetPasswordFormStore";

export interface ResetPasswordPageProps {
    token: string;
}

export class ResetPasswordPage extends AdminPageWithHeader<ResetPasswordPageProps> {

    title(): JSX.Element {
        return <span>Reset your password</span>
    }

    renderPageContent(): JSX.Element {
        const ResetPasswordForm = FormConnector(resetPasswordFormStore(this.props.location.params.token))(ResetPasswordFormComponent);
        return <ResetPasswordForm />;
    }
}