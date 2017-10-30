import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { accountActions } from "../../../actions/AccountActions";
import { FormConnector } from "alt-reform";
import { ResetPasswordFormComponent } from "./ResetPasswordFormComponent";
import { resetPasswordForm } from "./ResetPasswordForm";
import { accountStore } from "../../../stores/AccountStore";
import { connectToStores } from "../../../../shared/alt";
import { InternalLink } from "../../../../shared/components/InternalLink";
import { queryStringAsObject } from "../../../../shared/Helpers";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";

export interface ResetPasswordPageProps {
    token: string;
}

interface RequestResetButtonProps {
    tokenExpired: boolean;
}

const ResetPasswordForm = FormConnector(resetPasswordForm(accountStore))(ResetPasswordFormComponent);

export class ResetPasswordPage extends AdminPageWithHeader<ResetPasswordPageProps> {
    name(): string {
        return "Reset your password";
    }

    urlFragment(): string {
        return "set-password/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    load() {
        super.load();
        accountActions.setPasswordResetToken(queryStringAsObject().token);
    }

    renderPageContent(): JSX.Element {
        return <div>
            <ResetPasswordForm  />
            <ResetPasswordButton />
        </div>;
    }
}

class ResetPasswordButtonComponent extends React.Component<RequestResetButtonProps, undefined>{
    static getStores() {
        return [ accountStore ];
    }

    static getPropsFromStores(): RequestResetButtonProps {
        const account = accountStore.getState();
        return {
            tokenExpired: account.tokenExpired
        };
    }

    render() {
        const forgottenPasswordLinkStyle = () => {
            return this.props.tokenExpired ? { "display": "block" } : { "display": "none" };
        };

        return <div style={forgottenPasswordLinkStyle()}>
            <InternalLink href="/forgotten-password/">
                <button>Request new reset password link</button>
            </InternalLink>
        </div>

    }
}

const ResetPasswordButton = connectToStores(ResetPasswordButtonComponent);