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
import {InternalLink} from "../../../../shared/components/InternalLink";
import {ModelRunParametersContent} from "./ModelRunParametersContent";
import {Page} from "../../../../shared/components/PageWithHeader/Page";

const stochasticParams = require('../Overview/stochastic_template_params.csv');

export interface ModelRunParametersProps {
    groupId: string;
    touchstoneId: string;
}

export class ModelRunParametersPage extends ContribPageWithHeader<ModelRunParametersProps> {
    load(props: ModelRunParametersProps) {
        return this.loadParent(props).then(() => {
            return runParametersStore.fetchParameterSets();
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

    render() :JSX.Element {
        const guidanceOutputsUrl = `/help/model-outputs/#parameters`;

        return <Page page={this}>
            <div className="mt-2">
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
        </Page>
    }
}