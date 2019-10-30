import * as React from "react";
import {connect} from "react-redux";
import {compose} from "recompose";


import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {settings} from "../../../../shared/Settings";
import {ContribPage} from "../../../ContribPage";
import {responsibilityGuidanceModelInputsPageActionCreators} from "../../../actions/pages/responsibilityGuidancePageActionCreators";

import {ResponsibilityGuidancePageProps} from "./ResponsibilityGuidancePageProps";
import {ResponsibilityGuidanceModelInputsContent2017} from "./content/ResponsibilityGuidanceModelInputsContent2017";
import {ResponsibilityGuidanceModelInputsContentLatest} from "./content/ResponsibilityGuidanceModelInputsContentLatest";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "./content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {Redirect} from "react-router";

export class ResponsibilityGuidanceModelInputsPageComponent extends React.Component<ResponsibilityGuidancePageProps> {

    render(): JSX.Element {

        if (!this.props.touchstoneVersion) {
            return <LoadingElement/>
        }

        if (this.props.touchstoneVersion.status !== "open") {
            return <ResponsibilityGuidanceTouchstoneNotOpenContent/>
        }

        if (settings.is2017Touchstone(this.props.touchstoneVersion.id)) {
            return <ResponsibilityGuidanceModelInputsContent2017/>
        } else if (settings.is2019Touchstone(this.props.touchstoneVersion.id)) {
            const inputsPdf = require("./content/guidance-2019-inputs.pdf");
            return <Redirect to={inputsPdf}/>
        } else {
            return <ResponsibilityGuidanceModelInputsContentLatest/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ResponsibilityGuidancePageProps>):
    Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};

export const ResponsibilityGuidanceModelInputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps), ContribPage(responsibilityGuidanceModelInputsPageActionCreators))(ResponsibilityGuidanceModelInputsPageComponent);






