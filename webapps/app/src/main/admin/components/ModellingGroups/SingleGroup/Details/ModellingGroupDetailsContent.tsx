import * as React from "react";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { GroupMembersSummary } from "./GroupMembersSummary";
import { userStore } from "../../../../stores/UserStore";

import "../../../../../shared/styles/common.scss";
import {adminAuthStore} from "../../../../stores/AdminAuthStore";

interface Props extends RemoteContent {
    group: ModellingGroupDetails;
    users: User[];
    canManageGroupMembers: boolean;
}

class ModellingGroupDetailsContentComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return [ groupStore, userStore, adminAuthStore ];
    }
    static getPropsFromStores(): Props {
        const group = groupStore.getCurrentGroupDetails();
        const users = userStore.getState();
        return {
            group: group,
            users: users.users,
            ready: group != null && users.ready,
            canManageGroupMembers: adminAuthStore.hasPermission("*/modelling-groups.manage-members")
        };
    }

    renderContent(props: Props) {
        return <div className="col">
            <table className="specialColumn">
                <tbody>
                    <tr><td>ID</td><td>{ props.group.id }</td></tr>
                    <tr>
                        <td>Group members</td>
                        <td><GroupMembersSummary
                            group={props.group}
                            allUsers={props.users}
                            canEdit={props.canManageGroupMembers}
                        /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}

export const ModellingGroupDetailsContent = connectToStores(ModellingGroupDetailsContentComponent);