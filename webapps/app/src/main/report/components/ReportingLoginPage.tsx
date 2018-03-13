import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { LoginForm } from "../../shared/components/Login/LoginForm";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {breadcrumbsActions} from "../../shared/actions/breadcrumbsActions";
import {ReportAppState} from "../reducers/reportAppReducers";

export class ReportingLoginPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(null);
    }

    render(): JSX.Element {
        return <PageArticle title={"Log in"}>
            <LoginForm />
        </PageArticle>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<PageProperties<undefined>> => {
    return {
        createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActions.createBreadcrumbs(pageBreadcrumb))
    }
};

export const ReportingLoginPage = connect(state => state, mapDispatchToProps)(ReportingLoginPageComponent);
