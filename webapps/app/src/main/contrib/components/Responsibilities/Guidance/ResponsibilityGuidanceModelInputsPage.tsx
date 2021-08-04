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
import {ResponsibilityGuidanceModelInputsContent2021} from "./content/ResponsibilityGuidanceModelInputsContent2021";
import {ResponsibilityGuidanceModelInputsContentLatest} from "./content/ResponsibilityGuidanceModelInputsContentLatest";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "./content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";

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
            return <PageArticle title={"Guidance on model inputs: coverage and demographic data"}>
                <a href={inputsPdf} target={"_blank"}>
                    Guidance on model inputs: coverage and demographic data
                </a>
            </PageArticle>
        } else if (settings.is2021Touchstone(this.props.touchstoneVersion.id)) {
            return <ResponsibilityGuidanceModelInputsContent2021/>
        } else {
            return <ResponsibilityGuidanceModelInputsContentLatest/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};

export const ResponsibilityGuidanceModelInputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps), ContribPage(responsibilityGuidanceModelInputsPageActionCreators))(ResponsibilityGuidanceModelInputsPageComponent);






