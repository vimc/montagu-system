import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {ModelRunParametersContent} from "./ModelRunParametersContent";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {runParameterActions} from "../../../actions/RunParameterActions";

export interface ModelRunParametersProps {
    groupId: string;
    touchstoneId: string;
}

export class ModelRunParametersPage extends ContribPageWithHeader<ModelRunParametersProps> {
    load() {
        runParameterActions.clearUsedToken();
        modellingGroupActions.setCurrentGroup(this.props.location.params.groupId);
        responsibilityStore.fetchTouchstones().catch(doNothing).then(() => {
            touchstoneActions.setCurrentTouchstone(this.props.location.params.touchstoneId);
            responsibilityStore.fetchResponsibilities().catch(doNothing);
            runParametersStore.fetchParameterSets().catch(doNothing);
            runParametersStore.fetchOneTimeParametersToken(this.props.location.pathname).catch(doNothing);
            super.load();
        });
    }

    name() {
        return "Model run parameters";
    }

    title() {
        return <DownloadDataTitle title="Model run parameters"/>
    }

    urlFragment(): string {
        return 'model-run-parameters';
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        return <ModelRunParametersContent />
    }
}