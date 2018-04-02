import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import { DownloadDataTitle } from "../DownloadDataTitle";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { demographicStore } from "../../../stores/DemographicStore";
import { DownloadDemographicsContent } from "./DownloadDemographicsContent";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {
    ResponsibilityOverviewPage, ResponsibilityOverviewPageComponent, ResponsibilityOverviewPageLocationProps,
    ResponsibilityOverviewPageProps
} from "../Overview/ResponsibilityOverviewPage";
import { Page } from "../../../../shared/components/PageWithHeader/Page";
import {ChooseActionPage, ChooseActionPageComponent} from "../../ChooseAction/ChooseActionPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {responsibilityOverviewPageActionCreators} from "../../../actions/pages/responsibilityOverviewPageActionCreators";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {IExtendedResponsibilitySet} from "../../../models/ResponsibilitySet";

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

    // load(props: LocationProps) {
    //     return new ChooseActionPage().load(props).then(() => {
    //         touchstoneActions.setCurrentTouchstone(props.touchstoneId);
    //         return demographicStore.fetchDataSets();
    //     });
    // }

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
        onLoad: (params: DownloadDemographicsPageLocationProps) => dispatch(responsibilityOverviewPageActionCreators.onLoad(params))
    }
};

export const DownloadDemographicsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(DownloadDemographicsPageComponent) as React.ComponentClass<Partial<DownloadDemographicsPageProps>>;
