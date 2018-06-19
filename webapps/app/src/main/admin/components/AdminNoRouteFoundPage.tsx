import * as React from "react";
import {compose} from "recompose";

import {NoRouteFound} from "../../shared/components/NoRouteFound";
import {MainMenuNew} from "./MainMenu/MainMenuNew";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {AdminPageHeader} from "./AdminPageHeader";

export class AdminNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount() {
        this.props.createBreadcrumbs(MainMenuNew.breadcrumb());
    }

    static breadcrumb(): PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: MainMenuNew.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={NoRouteFound.title()}>
                {NoRouteFound.render()}
            </PageArticle>
        </div>;
    }
}

export const AdminNoRouteFoundPage = compose(BreadcrumbInitializer)(AdminNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;