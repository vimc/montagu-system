import {ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {longTimestamp} from "../../../../shared/Helpers";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";

interface Props extends RemoteContent {
    sets: ModelRunParameterSet[];
    touchstone: Touchstone;
}

export class ModelRunParameterSetsListComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return [runParametersStore, responsibilityStore];
    }

    static getPropsFromStores(props: Props): Props {
        const s = runParametersStore.getState();
        const responsibilityState = responsibilityStore.getState();
        return {
            sets: s.parameterSets,
            touchstone: responsibilityState.currentTouchstone,
            ready: s.parameterSets != null
        }
    }

    private renderTable(props: Props) {
        if (props.sets && props.sets.length > 0) {
            const items = props.sets.map(set => <tr>
                <td>{set.description}</td>
                <td>{set.uploaded_by}</td>
                <td>{longTimestamp(new Date(set.uploaded_on))}</td>
            </tr>);
            return <table>
                <thead>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Uploaded by</th>
                    <th scope="col">Uploaded on</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </table>;
        } else {
            return <span>No parameter sets have been uploaded for this touchstone</span>;
        }
    }

    renderContent(props: Props): JSX.Element {
        return <div>
            <div className="sectionTitle">All parameter sets for {props.touchstone.description}</div>
            {this.renderTable(props)}
        </div>;
    }
}

export const ModelRunParameterSetsList = connectToStores(ModelRunParameterSetsListComponent);
