import * as React from "react";

import {ResponsibilitiesPageTitle} from "../PageTitle";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {ModelRunParametersContent} from "./ModelRunParametersContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {modelRunParametersPageActionCreators} from "../../../actions/pages/modelRunParametersPageActionCreators";
import {ContribPage} from "../../../ContribPage";

const stochasticParams = require('../Overview/stochastic_template_params.csv');

export interface ModelRunParametersPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ModelRunParametersPageComponent extends React.Component<PageProperties<ModelRunParametersPageLocationProps>> {

    static pageName: string = "Upload parameters";

    static title(): JSX.Element {
        return <ResponsibilitiesPageTitle
            title={ModelRunParametersPageComponent.pageName}
        />
    }

    render() :JSX.Element {
        const guidanceOutputsUrl = `/help/model-outputs/#parameters`;

        return <PageArticle title={ModelRunParametersPageComponent.title()}>
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
        </PageArticle>
    }
}

export const ModelRunParametersPage = ContribPage(modelRunParametersPageActionCreators)(ModelRunParametersPageComponent);