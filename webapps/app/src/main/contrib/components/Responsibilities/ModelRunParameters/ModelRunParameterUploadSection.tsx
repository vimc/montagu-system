import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {UploadModelRunParametersForm} from "./UploadModelRunParametersForm";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";

export interface Props extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    parametersToken: string;
    diseases: string[];
}

export class ModelRunParameterUploadSectionComponent
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

    renderContent(props: Props): JSX.Element {
        return <div>
            <div className="sectionTitle">Upload a new parameter set</div>
            <UploadModelRunParametersForm groupId={props.group.id}
                                          token={props.parametersToken}
                                          diseases={props.diseases}
                                          touchstoneId={props.touchstone.id}
            />
        </div>;
    }
}

export const ModelRunParameterUploadSection = connectToStores(ModelRunParameterUploadSectionComponent);