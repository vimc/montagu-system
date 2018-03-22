import * as React from "react";
import { compose } from "recompose";

import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class ReportsListPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportsListPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Main menu",
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <PageArticle title="Choose a report to view">
            <ReportsListFilter/>
            <ReportsListSorting/>
            <ReportsList/>
        </PageArticle>;
    }
}

export const ReportsListPage = compose(BreadcrumbInitializer)(ReportsListPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
