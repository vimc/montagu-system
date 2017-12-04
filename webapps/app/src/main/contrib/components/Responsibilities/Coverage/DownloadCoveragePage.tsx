import * as React from "react";
import { touchstoneActions } from "../../../actions/TouchstoneActions";
import { responsibilityActions } from "../../../actions/ResponsibilityActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { DownloadCoverageContent } from "./DownloadCoverageContent";
import { modellingGroupActions } from "../../../../shared/actions/ModellingGroupActions";
import { doNothing } from "../../../../shared/Helpers";
import { DownloadDataTitle } from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePage extends ContribPageWithHeader<LocationProps> {
    load() {
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                responsibilityStore.fetchCoverageSets().catch(doNothing);
                responsibilityStore.fetchOneTimeCoverageToken().catch(doNothing);
                super.load();
            });
        });
    }

    name() {
        const s = responsibilityStore.getState();
        return `Download coverage for ${s.currentResponsibility.scenario.description}`;
    }

    title() {
        return <DownloadDataTitle title="Download coverage data" />
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `coverage/${s.currentResponsibility.scenario.id}/`;
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        return <DownloadCoverageContent />
    }
}