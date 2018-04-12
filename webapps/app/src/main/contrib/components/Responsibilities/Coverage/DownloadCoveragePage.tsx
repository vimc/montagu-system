import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import {DownloadCoverageContent} from "./DownloadCoverageContent";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {downloadCoveragePageActionCreators} from "../../../actions/pages/downloadCoveragePageActionCreators";

export interface DownloadCoveragePageLocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePageComponent extends React.Component<PageProperties<DownloadCoveragePageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Download coverage for ${state.responsibilities.currentResponsibility.scenario.description}`,
            urlFragment: `coverage/${state.responsibilities.currentResponsibility.scenario.id}/`,
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    title() {
        return <DownloadDataTitle title="Download coverage data"/>
    }

    render(): JSX.Element {
        return <PageArticle title={this.title()}>
            <DownloadCoverageContent/>
        </PageArticle>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<PageProperties<DownloadCoveragePageLocationProps>> => {
    return {
        onLoad: (params: DownloadCoveragePageLocationProps) => dispatch(downloadCoveragePageActionCreators.onLoad(params))
    }
};

export const DownloadCoveragePage = compose(
    connect(state => state, mapDispatchToProps),
)(DownloadCoveragePageComponent) as React.ComponentClass<Partial<PageProperties<DownloadCoveragePageLocationProps>>>;
