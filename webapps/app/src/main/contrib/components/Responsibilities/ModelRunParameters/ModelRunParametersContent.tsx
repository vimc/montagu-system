import * as React from "react";
import {connectToStores} from "../../../../shared/alt";
import {ModellingGroup, ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {UploadModelRunParametersForm} from "./UploadModelRunParametersForm";
import {ModelRunParameterSetsList} from "./ModelRunParameterSetsList";
import {runParametersStore} from "../../../stores/RunParametersStore";

export interface ModelRunParametersContentComponentProps extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    parametersToken: string;
    diseases: string[];
}

export class ModelRunParametersContentComponent extends RemoteContentComponent<ModelRunParametersContentComponentProps, undefined> {

    static getStores() {
        return [responsibilityStore, runParametersStore];
    }

    static getPropsFromStores(): ModelRunParametersContentComponentProps {
        const state = responsibilityStore.getState();
        const runParameterState = runParametersStore.getState();

        if (runParameterState.oneTimeToken != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                group: state.currentModellingGroup,
                parametersToken: runParameterState.oneTimeToken,
                diseases: Array.from(new Set([].concat.apply([],
                    state.responsibilitySets.map((set) => set.responsibilities.map(r => r.scenario.disease)))))
            };
        } else {
            return {
                ready: false,
                touchstone: null,
                group: null,
                parametersToken: null,
                diseases: []
            };
        }
    }

    renderContent(props: ModelRunParametersContentComponentProps) {

        return <div className="mt-2">
            <div className="sectionTitle">All parameter sets for {props.touchstone.description}</div>
            <ModelRunParameterSetsList />
            <div className="sectionTitle">Upload a new parameter set</div>
            <UploadModelRunParametersForm groupId={props.group.id}
                                          token={props.parametersToken}
                                          diseases={props.diseases}
                                          touchstoneId={props.touchstone.id}
            />
        </div>;
    }
}

export const ModelRunParametersContent = connectToStores(ModelRunParametersContentComponent);