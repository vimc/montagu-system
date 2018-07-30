import * as React from "react";
import {compose} from "recompose";

import {ForgottenPasswordForm} from "./Login/ForgottenPasswordForm";
import {PageArticle} from "./PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "./PageWithHeader/PageProperties";
import {BreadcrumbInitializer} from "./Breadcrumbs/BreadcrumbsInitializer";

const pageTitle = "Forgotten your password?";

export class ForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: pageTitle,
            urlFragment: "forgotten-password/"
        }
    }

    render(): JSX.Element {
        return <PageArticle title={pageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

export const ForgottenPasswordPage = compose(BreadcrumbInitializer)(ForgottenPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
