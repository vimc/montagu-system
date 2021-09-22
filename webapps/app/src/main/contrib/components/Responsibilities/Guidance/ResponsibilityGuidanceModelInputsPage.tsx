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

        const touchstoneId = this.props.touchstoneVersion.id;
        if (settings.is2017Touchstone(touchstoneId)) {
            return <ResponsibilityGuidanceModelInputsContent2017/>
        } else if (settings.is2019Touchstone(touchstoneId) || settings.is2021GaviTouchstone(touchstoneId)) {
            const inputsPdfFile = settings.is2019Touchstone(touchstoneId) ? "guidance-2019-inputs.pdf" : "guidance-2021-inputs.pdf";
            const inputsPdf = require(`./content/${inputsPdfFile}`);
            return <PageArticle title={"Guidance on model inputs: coverage and demographic data"}>
                <a href={inputsPdf} target={"_blank"}>
                    Guidance on model inputs: coverage and demographic data
                </a>
            </PageArticle>
        } else if (settings.is2021TestTouchstone(touchstoneId)) {
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






