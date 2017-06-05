import * as React from "react";
import { PageWithHeader } from "../../PageWithHeader/PageWithHeader";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { ResponsibilityDetailsTitle } from "./DownloadCoverageTitle";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ResponsibilityDetails } from "./DownloadCoverageComponent";

interface LocationProps {
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePage extends PageWithHeader<LocationProps> {
    componentDidMount() {
        touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
        responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
        responsibilityStore.fetchCoverageSets();
        responsibilityStore.fetchOneTimeCoverageToken();
    }

    title() {
        return <ResponsibilityDetailsTitle />
    }

    renderPageContent() {
        return <ResponsibilityDetails />
    }
}