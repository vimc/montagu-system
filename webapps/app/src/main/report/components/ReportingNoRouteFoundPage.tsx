import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { NoRouteFound } from "../../shared/components/NoRouteFound";
import { ReportsListPageComponent} from "./ReportsList/ReportsListPage";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {breadcrumbsActions} from "../../shared/actions/breadcrumbsActions";
import {ReportAppState} from "../reducers/reportAppReducers";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

export class ReportingNoRouteFoundPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportingNoRouteFoundPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: NoRouteFound.title(),
            urlFragment: null,
            parent: ReportsListPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={NoRouteFound.title()}>
            {NoRouteFound.render()}
        </PageArticle>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<PageProperties<undefined>> => {
    return {
        createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActions.createBreadcrumbs(pageBreadcrumb))
    }
};

export const ReportingNoRouteFoundPage = connect(state => state, mapDispatchToProps)(ReportingNoRouteFoundPageComponent);
