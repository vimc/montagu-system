import * as React from "react";
import { connect } from 'react-redux';

import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import { ResponsibilityOverviewContent } from "./ResponsibilityOverviewContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {TouchstoneVersion} from "../../../../shared/models/Generated";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {responsibilityOverviewPageActionCreators} from "../../../actions/pages/responsibilityOverviewPageActionCreators";
import {ContribPage} from "../../../ContribPage";
import {compose} from "recompose";

export interface ResponsibilityOverviewPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export interface ResponsibilityOverviewPageProps extends PageProperties<ResponsibilityOverviewPageLocationProps> {
    touchstone: TouchstoneVersion;
}

export class ResponsibilityOverviewPageComponent extends React.Component<ResponsibilityOverviewPageProps> {

    render(): JSX.Element {
        if (this.props.touchstone) {
            return <PageArticle title={`Responsibilities in ${this.props.touchstone.description }`}>
                <ResponsibilityOverviewContent/>
            </PageArticle>;
        } else {
            return <LoadingElement/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityOverviewPageProps> => {
    return {
        touchstone: state.touchstones.currentTouchstoneVersion
    }
};

export const ResponsibilityOverviewPage = compose<PageProperties<ResponsibilityOverviewPageLocationProps>,
    Partial<PageProperties<ResponsibilityOverviewPageLocationProps>>>(
    connect(mapStateToProps),ContribPage(responsibilityOverviewPageActionCreators))(ResponsibilityOverviewPageComponent);

