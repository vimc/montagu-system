import * as React from "react";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import { ModellingGroupDetails } from "../../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { GroupAdminSummary } from "./GroupAdminSummary";

const commonStyles = require("../../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    group: ModellingGroupDetails;
}

class ModellingGroupDetailsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ groupStore ];
    }
    static getPropsFromStores(): Props {
        const group = groupStore.getCurrentGroupDetails();
        return {
            group: group,
            ready: group != null
        };
    }

    renderContent(props: Props) {
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>ID</td><td>{ props.group.id }</td></tr>
                    <tr><td>Group admin</td><td><GroupAdminSummary { ...this.props.group } /></td></tr>
                </tbody>
            </table>
        </div>
    }
}

export const ModellingGroupDetailsContent = connectToStores(ModellingGroupDetailsContentComponent);