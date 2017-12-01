import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {estimateTokenActions} from "../../../actions/EstimateActions";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {
    processEncodedResultAndNotifyOnErrors
} from "../../../../shared/sources/Source";
import {helpers} from "../../../../shared/Helpers";
import {makeNotification, notificationActions} from "../../../../shared/actions/NotificationActions";

export interface UploadEstimatesProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPage extends ContribPageWithHeader<UploadEstimatesProps> {
    load() {

            if (processEncodedResultAndNotifyOnErrors<string>(helpers.queryStringAsObject()))
            {
                const notification = makeNotification("Success! You have uploaded a new set of burden estimates.", "info")
                notificationActions.notify(notification)
            }

        estimateTokenActions.clearUsedToken();
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                responsibilityStore.fetchOneTimeEstimatesToken(this.props.location.pathname).catch(doNothing)
                super.load();
            });
        });
    }

    name() {
        const r = responsibilityStore.getState();
        return r.currentResponsibility.scenario.id;
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

    renderPageContent() {
        return <UploadBurdenEstimatesContent/>
    }
}