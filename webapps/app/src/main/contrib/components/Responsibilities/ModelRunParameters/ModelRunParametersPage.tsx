import * as React from "react";
import {touchstoneActions} from "../../../actions/TouchstoneActions";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {modellingGroupActions} from "../../../../shared/actions/ModellingGroupActions";
import {doNothing} from "../../../../shared/Helpers";
import {DownloadDataTitle} from "../DownloadDataTitle";
import {ContribPageWithHeader} from "../../PageWithHeader/ContribPageWithHeader";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ResponsibilityOverviewPage} from "../Overview/ResponsibilityOverviewPage";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {runParameterActions} from "../../../actions/RunParameterActions";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {ModelRunParametersContent} from "./ModelRunParametersContent";

const stochasticParams = require('../Overview/stochastic_template_params.csv');

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
        return "Upload parameters";
    }

    title() {
        return <DownloadDataTitle title="Upload parameters"/>
    }

    urlFragment(): string {
        return 'parameters';
    }

    parent(): IPageWithParent {
        return new ResponsibilityOverviewPage();
    }

    renderPageContent() {
        const guidanceOutputsUrl = `/help/model-outputs/`;

        return <div className="mt-2">
            <p>
                <InternalLink href={guidanceOutputsUrl}>
                    Guidance on creating and uploading parameter sets
                </InternalLink>
            </p>
            <p>
                <a key={"params"}
                   href={stochasticParams}>Download stochastic parameters template</a>
            </p>
            <ModelRunParametersContent />
        </div>
    }
}