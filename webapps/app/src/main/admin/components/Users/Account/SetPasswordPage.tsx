import * as React from "react";
import {AdminPageWithHeader} from "../../AdminPageWithHeader";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";
import {Page} from "../../../../shared/components/PageWithHeader/Page";
import {SetPasswordForm} from "./SetPasswordFormComponent";
import {jwtTokenAuth} from "../../../../shared/modules/jwtTokenAuth";
import {helpers} from "../../../../shared/Helpers";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";

export class SetPasswordPage extends AdminPageWithHeader<PageProperties<undefined>> {
    name(): string {
        return "Enter a new password";
    }

    urlFragment(): string {
        return "set-password/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    render(): JSX.Element {
        const token = helpers.queryStringAsObject().token;

        let content: JSX.Element = null;
        if (content == null) {// jwtTokenAuth.isCompressedTokenValid(token)) {
            content = <SetPasswordForm resetToken={token}/>;
        } else {
            content = <RequestResetLinkButton/>;
        }

        return <Page page={this}>{content}</Page>;
    }
}

class RequestResetLinkButton extends React.Component<undefined> {
    render(): JSX.Element {
        return <div className="mt-3">
            <div className="alert alert-warning">This password reset link has expired. Please request a new one</div>
            <InternalLink href="/forgotten-password/">
                <button>Request new reset password link</button>
            </InternalLink>
        </div>;
    }
}