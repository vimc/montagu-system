import * as React from "react";
import { compose } from "recompose";

import { NoRouteFound } from "../../shared/components/NoRouteFound";
import {MainMenuNew} from "./MainMenu/MainMenuNew";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

export class AdminNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(MainMenuNew.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: MainMenuNew.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

export const AdminNoRouteFoundPage = compose(BreadcrumbInitializer)(AdminNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;