import * as React from "react";
import { FormConnector } from "alt-reform";
import { compose } from "recompose";

import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";
import {ReportsListPageComponent} from "./ReportsList/ReportsListPage";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("report"))(ForgottenPasswordFormComponent);

export class ReportingForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportingForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ForgottenPasswordPageTitle,
            urlFragment: "forgotten-password/",
            parent: ReportsListPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={ForgottenPasswordPageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

export const ReportingForgottenPasswordPage = compose(BreadcrumbInitializer)(ReportingForgottenPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
