import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import {ReportsList, ReportsListContainerProps} from "./ReportsList";
import {ReportsListSorting} from "./ReportsListSorting";
import {ReportsListFilter} from "./Filter/ReportsListFilter";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {PageInterface, PageProps} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ReportAppState} from "../../reducers/reportAppReducers";

export interface ReportsListPageProps extends PageProps<undefined> {
    createBreadcrumbs: (page: PageInterface) => void;
}

export class ReportsListPageComponent extends React.Component<ReportsListPageProps> implements PageInterface {

    componentDidMount(){
        this.props.createBreadcrumbs(this);
    }

    name() {
        return "Main menu";
    }

    title() {
        return "Choose a report to view";
    }

    urlFragment() {
        return "/";
    }

    parent(): IPageWithParent {
        return null;
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
        createBreadcrumbs: (page: PageInterface) => dispatch(breadcrumbsActions.createBreadcrumbs(page))
    }
};

export const ReportsListPage = connect(state => state, mapDispatchToProps)(ReportsListPageComponent);

