import * as React from "react";
import { compose } from "recompose";

import { NoRouteFound } from "../../shared/components/NoRouteFound";
import { ReportsListPageComponent} from "./ReportsList/ReportsListPage";
import {PageProperties} from "../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {BreadcrumbInitializer} from "../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageBreadcrumb} from "../../shared/components/PageWithHeader/PageProperties";
import {reportListPageActionCreators} from "../actionCreators/pages/ReportListPageActionCreators";

export class ReportingNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportingNoRouteFoundPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: reportListPageActionCreators.createBreadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

export const ReportingNoRouteFoundPage = compose(BreadcrumbInitializer)(ReportingNoRouteFoundPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
