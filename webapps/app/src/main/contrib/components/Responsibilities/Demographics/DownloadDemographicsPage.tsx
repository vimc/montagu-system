import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import { DownloadDataTitle } from "../DownloadDataTitle";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";
import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {downloadDemographicsPageActionCreators} from "../../../actions/pages/downloadDemographicsPageActionCreators";

export interface DownloadDemographicsPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export interface DownloadDemographicsPageProps extends PageProperties<DownloadDemographicsPageLocationProps> {
    touchstone: Touchstone;
    group: ModellingGroup;
}

export class DownloadDemographicsPageComponent extends React.Component<DownloadDemographicsPageProps> {
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
        return <DownloadDataTitle title="Download demographic data sets" />
    }

    render(): JSX.Element {
        return <PageArticle title={this.title()}>
            <DownloadDemographicsContent />
        </PageArticle>;
    }

}

export const mapStateToProps = (state: ContribAppState): Partial<DownloadDemographicsPageProps> => {
    console.log(2224, state)
    return {
        touchstone: state.touchstones.currentTouchstone,
        group: state.groups.currentUserGroup
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<DownloadDemographicsPageProps> => {
    return {
        onLoad: (params: DownloadDemographicsPageLocationProps) => dispatch(downloadDemographicsPageActionCreators.onLoad(params))
    }
};

export const DownloadDemographicsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(DownloadDemographicsPageComponent) as React.ComponentClass<Partial<DownloadDemographicsPageProps>>;
