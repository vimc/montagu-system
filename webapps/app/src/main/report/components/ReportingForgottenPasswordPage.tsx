import * as React from "react";
import { FormConnector } from "alt-reform";
import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import { ReportingPageWithHeader } from "./ReportingPageWithHeader";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";
import {IPageWithParent} from "../../shared/models/Breadcrumb";
import {ReportsListPage} from "./ReportsList/ReportsListPage";
import {Page} from "../../shared/components/PageWithHeader/Page";
import {ReportingPage} from "./ReportingPage";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("report"))(ForgottenPasswordFormComponent);

export class ReportingForgottenPasswordPage extends ReportingPageWithHeader<undefined> {
    name(): string {
        return ForgottenPasswordPageTitle;
    }

    urlFragment(): string {
        return "forgotten-password/";
    }

    parent(): IPageWithParent {
        return null//new ReportsListPage();
    }

    render(): JSX.Element {
        return <ReportingPage page={this}>
            <ForgottenPasswordForm />
        </ReportingPage>;
    }
}