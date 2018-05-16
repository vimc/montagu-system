import * as React from "react";
import {compose} from "recompose";

import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";

export class ReportsListPageComponent extends React.Component<PageProperties<undefined>> {
    static breadcrumb(): PageBreadcrumb {
        return {
            name: "Main menu",
            urlFragment: "/",
            parent: null
        }
    }

    componentDidMount() {
        this.props.createBreadcrumbs(ReportsListPageComponent.breadcrumb());
    }

    render(): JSX.Element {
        return <div className={"container-fluid pt-5"}>
            <div className={"row"}>
                <div className={"col-12 col-lg-10 offset-lg-1"}>
                    <ReportsListFilter/>
                    <ReportsListSorting/>
                    <ReportsList/>
                </div>
            </div>
        </div>;
    }
}

export const ReportsListPage = compose(BreadcrumbInitializer)(ReportsListPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;
