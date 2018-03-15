import * as React from "react";
import { compose } from "recompose";

import { LoginForm } from "../../shared/components/Login/LoginForm";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class ReportingLoginPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(null);
    }

    render(): JSX.Element {
        return <PageArticle title={"Log in"}>
            <LoginForm />
        </PageArticle>;
    }
}

export const ReportingLoginPage = compose(BreadcrumbInitializer)(ReportingLoginPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
