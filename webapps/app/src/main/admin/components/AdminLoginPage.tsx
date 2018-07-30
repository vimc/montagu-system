import * as React from "react";
import {compose} from "recompose";

import {LoginForm} from "../../shared/components/Login/LoginForm";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

import {PageProperties} from "../../shared/components/PageWithHeader/PageProperties";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class AdminLoginPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount() {
        this.props.createBreadcrumbs(null);
    }

    render(): JSX.Element {
        return <PageArticle title={"Log in"}>
                <LoginForm/>
            </PageArticle>;
    }
}

export const AdminLoginPage = compose(BreadcrumbInitializer)(AdminLoginPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;