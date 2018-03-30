import * as React from "react";
import { compose } from "recompose";

import {ForgottenPasswordForm} from "../../shared/components/Login/ForgottenPasswordForm";
import {ChooseGroupPageComponent} from "./ChooseGroup/ChooseGroupPage";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

const pageTitle = "Forgotten your password?";

export class ContribForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ContribForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: pageTitle,
            urlFragment: "forgotten-password/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={pageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

export const ContribForgottenPasswordPage = compose(BreadcrumbInitializer)(ContribForgottenPasswordPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
