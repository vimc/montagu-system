import * as React from "react";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {ModelRunParametersSection} from "./ModelRunParametersSection";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";

export interface ModelRunParametersContentProps {
    touchstone: Touchstone;
    group: ModellingGroup;
    diseases: string[];
}

export class ModelRunParametersContentComponent extends React.Component<ModelRunParametersContentProps> {
    render(): JSX.Element {
        const url = `/modelling-groups/${this.props.group.id}/model-run-parameters/${this.props.touchstone.id}/`;
        return <div>
            {
                this.props.diseases.map(d => <ModelRunParametersSection disease={d} url={url} key={d} />)
            }
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ModelRunParametersContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        group: state.groups.currentUserGroup,
        diseases: state.responsibilities.set ? [...new Set(state.responsibilities.set.responsibilities.map(r => r.scenario.disease))] : []
    }
};

export const ModelRunParametersContent = compose(
    connect(mapStateToProps),
    branch((props: ModelRunParametersContentProps) => !props.touchstone, renderComponent(LoadingElement))
)(ModelRunParametersContentComponent) as React.ComponentClass<Partial<ModelRunParametersContentProps>>;
