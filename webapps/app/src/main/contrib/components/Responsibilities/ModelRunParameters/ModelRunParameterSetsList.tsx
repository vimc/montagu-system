import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {longTimestamp} from "../../../../shared/Helpers";

interface Props extends RemoteContent {
    sets: ModelRunParameterSet[];
}

export class ModelRunParameterSetsListComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return runParametersStore;
    }

    static getPropsFromStores(props: Props) {
        const s = runParametersStore.getState();
        return {
            sets: s.parameterSets,
            ready: s.parameterSets != null
        }
    }

    renderContent(props: Props): JSX.Element {
        const items = props.sets.map(set => <tr>
            <td>{set.description}</td>
            <td>{set.uploaded_by}</td>
            <td>{longTimestamp(new Date(set.uploaded_on))}</td>
        </tr>);
        return <table className="table table-responsive">
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
    }
}

export const ModelRunParameterSetsList = connectToStores(ModelRunParameterSetsListComponent);
