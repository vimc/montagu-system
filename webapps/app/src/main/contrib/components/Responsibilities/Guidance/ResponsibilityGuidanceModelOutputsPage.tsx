import * as React from "react";
import {connect} from "react-redux";
import {compose} from "recompose";

import {ContribAppState} from "../../../reducers/contribAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {settings} from "../../../../shared/Settings";
import {ContribPage} from "../../../ContribPage";
import {responsibilityGuidanceModelOutputsPageActionCreators} from "../../../actions/pages/responsibilityGuidancePageActionCreators";

import {ResponsibilityGuidancePageProps} from "./ResponsibilityGuidancePageProps";
import {ResponsibilityGuidanceModelOutputsContent2017} from "./content/ResponsibilityGuidanceModelOutputsContent2017";
import {ResponsibilityGuidanceModelOutputsContentLatest} from "./content/ResponsibilityGuidanceModelOutputsContentLatest";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "./content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {Redirect} from "react-router";

export class ResponsibilityGuidanceModelOutputsPageComponent extends React.Component<ResponsibilityGuidancePageProps> {

    render(): JSX.Element {

        if (!this.props.touchstoneVersion) {
            return <LoadingElement/>
        }

        if (this.props.touchstoneVersion.status !== "open") {
            return <ResponsibilityGuidanceTouchstoneNotOpenContent/>
        }

        if (settings.is2017Touchstone(this.props.touchstoneVersion.id)) {
            return <ResponsibilityGuidanceModelOutputsContent2017/>
        } else if (settings.is2019Touchstone(this.props.touchstoneVersion.id)) {
            const outputsPdf = require("./content/guidance-2019-outputs.pdf");
            return <Redirect to={outputsPdf}/>
        } else {
            return <ResponsibilityGuidanceModelOutputsContentLatest/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ResponsibilityGuidancePageProps>):
    Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};

export const ResponsibilityGuidanceModelOutputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps), ContribPage(responsibilityGuidanceModelOutputsPageActionCreators))(ResponsibilityGuidanceModelOutputsPageComponent);






