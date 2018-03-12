import * as React from "react";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {estimateTokenActions} from "../../../actions/EstimateActions";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import { Page } from "../../../../shared/components/PageWithHeader/Page";
import {appSettings} from "../../../../shared/Settings";

export interface UploadEstimatesProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPage extends ContribPageWithHeader<UploadEstimatesProps> {

    load(props: UploadEstimatesProps) {

        return this.loadParent(props).then(() => {
            estimateTokenActions.clearUsedToken();
            estimateTokenActions.setRedirectPath(appSettings.publicPath + "/" + this.props.location.pathname);

            responsibilityActions.setCurrentResponsibility(props.scenarioId);
            responsibilityStore.fetchOneTimeEstimatesToken().catch(doNothing);
        });
    }

    name() {
        const r = responsibilityStore.getState();
        return `Upload burden estimates for ${r.currentResponsibility.scenario.description}`;
    }

    title() {
        return <DownloadDataTitle title="Upload burden estimates"/>
    }

    urlFragment(): string {
        const r = responsibilityStore.getState();
        return `burdens/${r.currentResponsibility.scenario.id}`;
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    render() :JSX.Element {
        return <Page page={this}>
            <UploadBurdenEstimatesContent/>
        </Page>
    }
}