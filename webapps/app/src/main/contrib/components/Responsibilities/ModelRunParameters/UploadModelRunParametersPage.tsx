import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {UploadModelRunParametersContent} from "./UploadModelRunParametersContent";
import {modelParameterActions} from "../../../actions/ModelParameterActions";

export interface UploadModelRunParametersProps {
    groupId: string;
    touchstoneId: string;
}

export class UploadModelRunParametersPage extends ContribPageWithHeader<UploadModelRunParametersProps> {
    load() {

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
        return <UploadModelRunParametersContent />
    }
}