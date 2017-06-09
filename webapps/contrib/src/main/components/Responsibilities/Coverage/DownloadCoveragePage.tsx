import * as React from "react";
import { PageWithHeader } from "../../PageWithHeader/PageWithHeader";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { DownloadCoverageTitle } from "./DownloadCoverageTitle";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { DownloadCoverageContent } from "./DownloadCoverageContent";
import { modellingGroupActions } from "../../../actions/ModellingGroupActions";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePage extends PageWithHeader<LocationProps> {
    componentDidMount() {
        modellingGroupActions.setCurrentModellingGroup(this.props.location.params.groupId);
        touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
        responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
        responsibilityStore.fetchCoverageSets();
        responsibilityStore.fetchOneTimeCoverageToken();
    }

    title() {
        return <DownloadCoverageTitle />
    }

    renderPageContent() {
        return <DownloadCoverageContent />
    }
}