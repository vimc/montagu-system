import * as React from "react";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { GroupAdminSummary } from "./GroupAdminSummary";
import { userStore } from "../../../../stores/UserStore";

const commonStyles = require("../../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    group: ModellingGroupDetails;
    users: User[];
}

class ModellingGroupDetailsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ groupStore, userStore ];
    }
    static getPropsFromStores(): Props {
        const group = groupStore.getCurrentGroupDetails();
        const users = userStore.getState();
        return {
            group: group,
            users: users.users,
            ready: group != null && users.ready
        };
    }

    renderContent(props: Props) {
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>ID</td><td>{ props.group.id }</td></tr>
                    <tr>
                        <td>Group admin</td>
                        <td><GroupAdminSummary group={ this.props.group } allUsers={ this.props.users } /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}

export const ModellingGroupDetailsContent = connectToStores(ModellingGroupDetailsContentComponent);