import {ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {runParametersStore} from "../../../stores/RunParametersStore";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import * as React from "react";
import {longTimestamp} from "../../../../shared/Helpers";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import { Base64 } from 'js-base64';

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

    makeSignatureContent(set: ModelRunParameterSet): Array<any> {
        const setData = {
            id: set.id,
            disease: set.disease,
            uploaded_by: set.uploaded_by,
            uploaded_on: set.uploaded_on
        };
        const signature = Base64.encode(JSON.stringify(setData));
        return [setData, { signature }];
    }


    private makeDownloadableSignatureLinkContent(set: ModelRunParameterSet) {
        const signatureData = this.makeSignatureContent(set);
        return "data: text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signatureData, null, 2));
    }

    private renderTable(props: Props) {
        if (props.sets && props.sets.length > 0) {
            const items = props.sets.map((set, i) => <tr key={i}>
                <td>{set.description}</td>
                <td>{set.uploaded_by}</td>
                <td>{longTimestamp(new Date(set.uploaded_on))}</td>
                <td>
                    <a
                        href={this.makeDownloadableSignatureLinkContent(set)}
                        download={`signature${set.id}`}
                    >Link</a>
                </td>
            </tr>);
            return <table>
                <thead>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Uploaded by</th>
                    <th scope="col">Uploaded on</th>
                    <th scope="col">Download</th>
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
