import * as React from "react";
import {Action, Dispatch} from "redux";
import {compose} from "recompose";
import {connect} from 'react-redux';

import {DownloadDataTitle} from "../DownloadDataTitle";
import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {ModelRunParametersContent} from "./ModelRunParametersContent";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {modelRunParametersPageActionCreators} from "../../../actions/pages/modelRunParametersPageActionCreators";

const stochasticParams = require('../Overview/stochastic_template_params.csv');

export interface ModelRunParametersPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

export class ModelRunParametersPageComponent extends React.Component<PageProperties<ModelRunParametersPageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static pageName: string = "Upload parameters";

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: ModelRunParametersPageComponent.pageName,
            urlFragment: "parameters/",
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    title(): JSX.Element {
        return <DownloadDataTitle
            title={ModelRunParametersPageComponent.pageName}
        />
    }

    render() :JSX.Element {
        const guidanceOutputsUrl = `/help/model-outputs/#parameters`;

        return <PageArticle title={this.title()}>
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

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<PageProperties<ModelRunParametersPageLocationProps>> => {
    return {
        onLoad: (params: ModelRunParametersPageLocationProps) => dispatch(modelRunParametersPageActionCreators.onLoad(params))
    }
};

export const ModelRunParametersPage = compose(
    connect(state => state, mapDispatchToProps),
)(ModelRunParametersPageComponent) as React.ComponentClass<Partial<PageProperties<ModelRunParametersPageLocationProps>>>;
