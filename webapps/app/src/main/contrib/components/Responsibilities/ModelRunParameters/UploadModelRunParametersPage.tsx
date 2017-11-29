import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {estimateTokenActions} from "../../../actions/EstimateActions";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {
    processEncodedResultAndNotifyOnErrors
} from "../../../../shared/sources/Source";
import {helpers} from "../../../../shared/Helpers";
import {makeNotification, notificationActions} from "../../../../shared/actions/NotificationActions";
import {UploadModelRunParametersContent} from "./UploadModelRunParametersContent";
import {modelParameterActions} from "../../../actions/ModelParameterActions";

export interface UploadModelRunParametersProps {
    groupId: string;
    touchstoneId: string;
    diseases: string[];
}

export class UploadModelRunParametersPage extends ContribPageWithHeader<UploadModelRunParametersProps> {
    load() {

            if (processEncodedResultAndNotifyOnErrors<string>(helpers.queryStringAsObject()))
            {
                const notification = makeNotification("Success! You have uploaded a new set of model run parameters.", "info");
                notificationActions.notify(notification)
            }

        modelParameterActions.clearUsedToken();
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing);
            responsibilityStore.fetchOneTimeParametersToken(this.props.location.pathname).catch(doNothing);
            super.load();
        });
    }

    name() {
        return "Upload burden estimates";
    }

    title() {
        return <DownloadDataTitle title="Upload model run parameters"/>
    }

    urlFragment(): string {
        return 'model-run-parameters';
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        return <UploadModelRunParametersContent/>
    }
}