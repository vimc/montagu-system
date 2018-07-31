import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import { ResponsibilitiesPageTitle } from "../PageTitle";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";
import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {downloadDemographicsPageActionCreators} from "../../../actions/pages/downloadDemographicsPageActionCreators";
import {PageBreadcrumb} from "../../../../shared/components/PageWithHeader/PageProperties";

export interface DownloadDemographicsPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export class DownloadDemographicsPageComponent extends React.Component<PageProperties<DownloadDemographicsPageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: "Download demographic data sets",
            urlFragment: "demographics/",
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    title(): JSX.Element {
        return <ResponsibilitiesPageTitle
            title="Download demographic data sets"
        />;
    }

    render(): JSX.Element {
        return <PageArticle title={this.title()}>
            <DownloadDemographicsContent/>
        </PageArticle>;
    }

}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<PageProperties<DownloadDemographicsPageLocationProps>> => {
    return {
        onLoad: (params: DownloadDemographicsPageLocationProps) => dispatch(downloadDemographicsPageActionCreators.onLoad(params))
    }
};

export const DownloadDemographicsPage = compose(
    connect(state => state, mapDispatchToProps),
)(DownloadDemographicsPageComponent) as React.ComponentClass<Partial<PageProperties<DownloadDemographicsPageLocationProps>>>;
