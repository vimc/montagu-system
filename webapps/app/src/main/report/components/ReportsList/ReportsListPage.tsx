import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {ReportsList} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import { PageProps} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ReportAppState} from "../../reducers/reportAppReducers";

export interface ReportsListPageProps extends PageProps<undefined> {
    createBreadcrumbs: (page: any, props: any) => void;
}

export class ReportsListPageComponent extends React.Component<ReportsListPageProps> {

    componentDidMount(){
        this.props.createBreadcrumbs(ReportsListPageComponent.breadcrumb, this.props);
    }

    title() {
        return "Choose a report to view";
    }

    static breadcrumb(params: any) {
        return {
            name: "Main menu",
            urlFragment: "/",
            parent: null as any
        }
    }

    render() :JSX.Element {
        return <PageArticle title={this.title()}>
            <ReportsListFilter/>
            <ReportsListSorting/>
            <ReportsList/>
        </PageArticle>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<ReportsListPageProps> => {
    return {
        createBreadcrumbs: (page: any, props: any) => dispatch(breadcrumbsActions.createBreadcrumbs(page, props))
    }
};

export const ReportsListPage = connect(state => state, mapDispatchToProps)(ReportsListPageComponent);

