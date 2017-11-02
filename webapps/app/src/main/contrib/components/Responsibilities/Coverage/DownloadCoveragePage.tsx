import * as React from "react";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { DownloadCoverageContent } from "./DownloadCoverageContent";
import { modellingGroupActions } from "../../../../shared/actions/ModellingGroupActions";
import { PageWithHeaderAndNav } from "../../PageWithHeader/PageWithHeaderAndNav";
import { doNothing } from "../../../../shared/Helpers";
import { DownloadDataTitle } from "../DownloadDataTitle";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePage extends PageWithHeaderAndNav<LocationProps> {
    componentDidMount() {
        setTimeout(() => {
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
                responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                    responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                    responsibilityStore.fetchCoverageSets().catch(doNothing);
                    responsibilityStore.fetchOneTimeCoverageToken().catch(doNothing);
                });
            });
        });
    }

    title() {
        return <DownloadDataTitle title="Download coverage data" />
    }

    renderPageContent() {
        return <DownloadCoverageContent />
    }
}