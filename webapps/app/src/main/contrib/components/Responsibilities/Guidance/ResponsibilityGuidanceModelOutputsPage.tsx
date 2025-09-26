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
import {ResponsibilityGuidanceModelOutputsContent2021} from "./content/ResponsibilityGuidanceModelOutputsContent2021";
import {ResponsibilityGuidanceModelOutputsContentLatest} from "./content/ResponsibilityGuidanceModelOutputsContentLatest";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "./content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";

export class ResponsibilityGuidanceModelOutputsPageComponent extends React.Component<ResponsibilityGuidancePageProps> {

    render(): JSX.Element {

        if (!this.props.touchstoneVersion) {
            return <LoadingElement/>
        }

        if (this.props.touchstoneVersion.status !== "open") {
            return <ResponsibilityGuidanceTouchstoneNotOpenContent/>
        }

        const touchstoneId = this.props.touchstoneVersion.id;
        if (settings.is2017Touchstone(touchstoneId)) {
            return <ResponsibilityGuidanceModelOutputsContent2017/>
        } else if (settings.is2019Touchstone(touchstoneId) || settings.is2021GaviTouchstone(touchstoneId)) {
            const outputsPdfFile = settings.is2019Touchstone(touchstoneId) ? "guidance-2019-outputs.pdf" : "guidance-2021-outputs.pdf";
            const outputsPdf = require(`./content/${outputsPdfFile}`);
            return <PageArticle title={"Guidance on model outputs: how to generate and upload central estimates"}>
                <a href={outputsPdf} target={"_blank"}>
                    Guidance on model outputs: how to generate and upload central estimates
                </a>
            </PageArticle>
        } else if (settings.is2021TestTouchstone(touchstoneId)) {
            return <ResponsibilityGuidanceModelOutputsContent2021/>
        } else {
            return <ResponsibilityGuidanceModelOutputsContentLatest/>
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ResponsibilityGuidancePageProps> => {
    return {
        touchstoneVersion: state.touchstones.currentTouchstoneVersion,
    }
};

export const ResponsibilityGuidanceModelOutputsPage = compose<ResponsibilityGuidancePageProps,
    Partial<ResponsibilityGuidancePageProps>>(
    connect(mapStateToProps), ContribPage(responsibilityGuidanceModelOutputsPageActionCreators))(ResponsibilityGuidanceModelOutputsPageComponent);






