import * as React from "react";
import {compose} from "recompose";

import {NoRouteFound} from "../../shared/components/NoRouteFound";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageProperties";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {mainMenuPageActionCreators} from "../actions/pages/MainMenuPageActionCreators";

export class AdminNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount() {
        const breadcrumb: PageBreadcrumb = {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: mainMenuPageActionCreators.createBreadcrumb()
        };

        this.props.createBreadcrumbs(breadcrumb);
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

export const AdminNoRouteFoundPage = compose(BreadcrumbInitializer)(AdminNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;