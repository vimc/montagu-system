import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {ModellingGroup, ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {mockModelRunParameterSet} from "../../../../../test/mocks/mockModels";
import {ModelRunParametersSection} from "./ModelRunParametersSection";

export interface Props extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    diseases: string[];
    sets: ModelRunParameterSet[];
}

export class ModelRunParametersContentComponent
    extends RemoteContentComponent<Props, undefined> {


    static getStores() {
        return [responsibilityStore, runParametersStore];
    }

    static getPropsFromStores(): Props {
        const state = responsibilityStore.getState();
        const runParameterState = runParametersStore.getState();

        if (runParameterState.oneTimeToken != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                group: state.currentModellingGroup,
                sets: runParameterState.parameterSets,
                diseases: Array.from(new Set([].concat.apply([],
                    state.responsibilitySets.map(set => set.responsibilities.map(r => r.scenario.disease)))))
            };
        } else {
            return {
                ready: false,
                touchstone: null,
                group: null,
                diseases: [],
                sets: []
            };
        }
    }

    renderContent(props: Props): JSX.Element {
        this.props.diseases.push("Hib");
        this.props.sets.push(mockModelRunParameterSet(), mockModelRunParameterSet({disease: "YF"}));

        const url = `/modelling-groups/${this.props.group.id}/model-run-parameters/${this.props.touchstone.id}/`;
        return <div>
            {
                this.props.diseases.map(d => <ModelRunParametersSection key={d} url={url}
                                                                       disease={d} sets={props.sets.filter(set => set.disease == d)} />)
            }
        </div>;
    }
}

export const ModelRunParametersContent = connectToStores(ModelRunParametersContentComponent);