import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ReportAppState} from "../../reducers/reportAppReducers";

export interface ReportsListPageProps extends PageProperties<undefined> {
    createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => void;
}

export class ReportsListPageComponent extends React.Component<ReportsListPageProps> {
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

const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<ReportsListPageProps> => {
    return {
        createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActions.createBreadcrumbs(pageBreadcrumb))
    }
};

export const ReportsListPage = connect(state => state, mapDispatchToProps)(ReportsListPageComponent);

