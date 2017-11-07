import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityActions} from "../../../actions/ResponsibilityActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {PageWithHeaderAndNav} from "../../PageWithHeader/PageWithHeaderAndNav";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {estimateTokenActions} from "../../../actions/EstimateActions";
import {
    processEncodedResultAndNotifyOnErrors
} from "../../../../shared/sources/Source";
import {queryStringAsObject} from "../../../../shared/Helpers";

export interface UploadEstimatesProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export class UploadBurdenEstimatesPage extends PageWithHeaderAndNav<UploadEstimatesProps> {
    componentDidMount() {
        setTimeout(() => {
            const query = queryStringAsObject();

            if (query && query.result && query.result.length > 0) {
                processEncodedResultAndNotifyOnErrors<string>(query.result)
            }

            estimateTokenActions.clearUsedToken();
            modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
            responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
                touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
                responsibilityStore.fetchResponsibilities().catch(doNothing).then(() => {
                    responsibilityActions.setCurrentResponsibility(this.props.location.params.scenarioId);
                    responsibilityActions.setRedirectPath(this.props.location.pathname);
                    responsibilityStore.fetchOneTimeEstimatesToken().catch(doNothing)
                });
            });
        });
    }

    title() {
        return <DownloadDataTitle title="Upload burden estimates"/>
    }

    renderPageContent() {
        return <UploadBurdenEstimatesContent/>
    }
}