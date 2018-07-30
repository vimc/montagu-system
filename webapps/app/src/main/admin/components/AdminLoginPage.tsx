import * as React from "react";
import {compose} from "recompose";

import {LoginForm} from "../../shared/components/Login/LoginForm";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

import {PageProperties} from "../../shared/components/PageWithHeader/PageProperties";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {AdminPageHeader} from "./AdminPageHeader";

export class AdminLoginPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount() {
        this.props.createBreadcrumbs(null);
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={"Log in"}>
                <LoginForm/>
            </PageArticle>
        </div>;
    }
}

export const AdminLoginPage = compose(BreadcrumbInitializer)(AdminLoginPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;