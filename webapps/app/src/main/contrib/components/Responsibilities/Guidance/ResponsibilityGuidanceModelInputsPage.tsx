import * as React from "react";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";


import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribPage} from "../../../ContribPage";
import {responsibilityGuidanceModelInputsPageActionCreators} from "../../../actions/pages/responsibilityGuidancePageActionCreators";

import { ResponsibilityGuidancePageProps, ResponsibilityGuidancePageComponent} from "./ResponsibilityGuidancePage";
import { ResponsibilityGuidanceModelInputsContent2017} from "./ResponsibilityGuidanceModelInputsContent2017";
import { ResponsibilityGuidanceModelInputsContentLatest} from "./ResponsibilityGuidanceModelInputsContentLatest";

const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion
    }
};


export class ResponsibilityGuidanceModelInputsPageComponent extends ResponsibilityGuidancePageComponent {

    render() :JSX.Element {

        if (!this.props.touchstoneVersion)
        {
            return <LoadingElement/>
        }

        if (this.currentTouchstoneIs2017()) {
            return <ResponsibilityGuidanceModelInputsContent2017/>
        }
        else {
            return <ResponsibilityGuidanceModelInputsContentLatest/>
        }
    }
}

export const ResponsibilityGuidanceModelInputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps),ContribPage(responsibilityGuidanceModelInputsPageActionCreators))(ResponsibilityGuidanceModelInputsPageComponent);






