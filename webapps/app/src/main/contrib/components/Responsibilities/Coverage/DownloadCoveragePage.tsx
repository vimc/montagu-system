import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {DownloadCoverageContent} from "./DownloadCoverageContent";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {Page} from "../../../../shared/components/PageWithHeader/Page";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";

interface LocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class DownloadCoveragePage extends ContribPageWithHeader<LocationProps> {
    load(props: PageProperties<LocationProps>) {
        return this.loadParent(props).then(() => {
            responsibilityActions.setCurrentResponsibility(props.match.params.scenarioId);
            responsibilityStore.fetchOneTimeCoverageToken().catch(doNothing);
            return responsibilityStore.fetchCoverageSets();
        });
    }

    name() {
        const s = responsibilityStore.getState();
        return `Download coverage for ${s.currentResponsibility.scenario.description}`;
    }

    title() {
        return <DownloadDataTitle title="Download coverage data"/>
    }

    urlFragment(): string {
        const s = responsibilityStore.getState();
        return `coverage/${s.currentResponsibility.scenario.id}/`;
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <DownloadCoverageContent/>
        </Page>
    }
}