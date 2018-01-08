import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {ModellingGroup, ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {ModelRunParametersSection} from "./ModelRunParametersSection";

export interface Props extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    diseases: string[];
}

export class ModelRunParametersContentComponent
    extends RemoteContentComponent<Props, undefined> {

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): Props {
        const state = responsibilityStore.getState();

        return {
            ready: state.ready,
            touchstone: state.currentTouchstone,
            group: state.currentModellingGroup,
            diseases: Array.from(new Set([].concat.apply([],
                state.responsibilitySets.map(set => set.responsibilities.map(r => r.scenario.disease)))))
        };
    }

    renderContent(props: Props): JSX.Element {

        const url = `/modelling-groups/${this.props.group.id}/model-run-parameters/${this.props.touchstone.id}/`;

        return <div>
            {
                this.props.diseases.map(d => <ModelRunParametersSection disease={d} url={url} key={d} />)
            }
        </div>;
    }
}

export const ModelRunParametersContent = connectToStores(ModelRunParametersContentComponent);