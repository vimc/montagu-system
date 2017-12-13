import * as React from "react";
import {connectToStores} from "../../../../shared/alt";
import {ModellingGroup, Touchstone} from "../../../../shared/models/Generated";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {UploadModelRunParametersForm} from "./UploadModelRunParametersForm";

export interface ModelRunParametersContentComponentProps extends RemoteContent {
    touchstone: Touchstone;
    group: ModellingGroup;
    parametersToken: string;
    diseases: string[];
}

export class ModelRunParametersContentComponent extends RemoteContentComponent<ModelRunParametersContentComponentProps, undefined> {

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): ModelRunParametersContentComponentProps {
        const state = responsibilityStore.getState();

        if (state.parametersOneTimeToken != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                group: state.currentModellingGroup,
                parametersToken: state.parametersOneTimeToken,
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
            <UploadModelRunParametersForm groupId={props.group.id}
                                          token={props.parametersToken}
                                          diseases={props.diseases}
                                          touchstoneId={props.touchstone.id}
            />
        </div>;
    }
}

export const ModelRunParametersContent = connectToStores(ModelRunParametersContentComponent);