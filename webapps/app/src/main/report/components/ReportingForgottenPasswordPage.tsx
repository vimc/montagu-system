import * as React from "react";
import { FormConnector } from "alt-reform";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { forgottenPasswordFormStore } from "../../shared/components/Login/ForgottenPasswordFormStore";
import {
    ForgottenPasswordFormComponent,
    ForgottenPasswordPageTitle
} from "../../shared/components/Login/ForgottenPasswordForm";
import {ReportsListPageComponent} from "./ReportsList/ReportsListPage";
import {PageBreadcrumb, PageProperties} from "../../shared/components/PageWithHeader/PageWithHeader";
import {breadcrumbsActions} from "../../shared/actions/breadcrumbsActions";
import {ReportAppState} from "../reducers/reportAppReducers";
import {PageArticle} from "../../shared/components/PageWithHeader/PageArticle";

const ForgottenPasswordForm = FormConnector(forgottenPasswordFormStore("report"))(ForgottenPasswordFormComponent);

export class ReportingForgottenPasswordPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ReportingForgottenPasswordPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ForgottenPasswordPageTitle,
            urlFragment: "forgotten-password/",
            parent: ReportsListPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <PageArticle title={ForgottenPasswordPageTitle}>
            <ForgottenPasswordForm />
        </PageArticle>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<PageProperties<undefined>> => {
    return {
        createBreadcrumbs: (pageBreadcrumb: PageBreadcrumb) => dispatch(breadcrumbsActions.createBreadcrumbs(pageBreadcrumb))
    }
};

export const ReportingForgottenPasswordPage = connect(state => state, mapDispatchToProps)(ReportingForgottenPasswordPageComponent);
