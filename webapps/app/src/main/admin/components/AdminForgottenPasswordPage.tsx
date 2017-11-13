import * as React from "react";
import { FormConnector } from "alt-reform";
import { AdminPageWithHeader } from "./AdminPageWithHeader";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {MainMenu} from "./MainMenu/MainMenu";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("admin"))(ForgottenPasswordFormComponent);

export class AdminForgottenPasswordPage extends AdminPageWithHeader<undefined> {
    name(): string {
        return ForgottenPasswordPageTitle;
    }

    urlFragment(): string {
        return "forgotten-password/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    renderPageContent(): JSX.Element {
        return <ForgottenPasswordForm />;
    }
}