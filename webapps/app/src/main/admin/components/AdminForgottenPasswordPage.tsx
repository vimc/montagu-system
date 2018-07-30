import * as React from "react";
import {ForgottenPasswordForm} from "../../shared/components/Login/ForgottenPasswordForm";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {AdminPageHeader} from "./AdminPageHeader";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {ContribForgottenPasswordPageComponent} from "../../contrib/components/ContribForgottenPasswordPage";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {compose} from "recompose";

const pageTitle = "Forgotten your password?";

class AdminForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount() {
        this.props.createBreadcrumbs(AdminForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: pageTitle,
            urlFragment: "forgotten-password/"
        }
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={pageTitle}>
                <ForgottenPasswordForm/>
            </PageArticle>
        </div>;
    }
}

const connector = compose(BreadcrumbInitializer);
export const AdminForgottenPasswordPage = connector(AdminForgottenPasswordPageComponent);
