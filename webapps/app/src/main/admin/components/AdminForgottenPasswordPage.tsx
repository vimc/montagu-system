import * as React from "react";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { ForgottenPasswordForm } from "../../shared/components/Login/ForgottenPasswordForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {MainMenu} from "./MainMenu/MainMenu";
import { Page } from "../../shared/components/PageWithHeader/Page";

const pageTitle = "Forgotten your password?";

export class AdminForgottenPasswordPage extends AdminPageWithHeader<undefined> {
    name(): string {
        return pageTitle;
    }

    urlFragment(): string {
        return "forgotten-password/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <ForgottenPasswordForm />
        </Page>;
    }
}