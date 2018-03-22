import * as React from "react";
import { compose } from "recompose";

import {ForgottenPasswordForm} from "../../shared/components/Login/ForgottenPasswordForm";
import {ReportsListPageComponent} from "./ReportsList/ReportsListPage";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

const pageTitle = "Forgotten your password?";

export class ReportingForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportingForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: pageTitle,
            urlFragment: "forgotten-password/",
            parent: ReportsListPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={pageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

export const ReportingForgottenPasswordPage = compose(BreadcrumbInitializer)(ReportingForgottenPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
