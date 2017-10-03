import * as React from "react";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import {  User } from "../../../../../shared/models/Generated";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { userStore } from "../../../../stores/UserStore";
import { ListOfUsers } from "../../ListOfUsers";
import { AddMember } from "./AddMember";

const commonStyles = require("../../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    members: User[];
    users: User[];
    groupId: string;
}

export class GroupAdminContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ groupStore, userStore ];
    }

    static getPropsFromStores(): Props {
        const group = groupStore.getCurrentGroupDetails();
        const allUsers = userStore.getState().users;
        const members = groupStore.getCurrentGroupMembers();

        if (group != null) {
            return {
                users: allUsers,
                members: members.map(a => allUsers.find(u => a == u.username)),
                ready: group != null && userStore.getState().ready,
                groupId: group.id
            };
        } else {
            return {
                users: [],
                members: [],
                ready: false,
                groupId: ""
            };
        }
    }

    renderCurrent(props: Props): JSX.Element {
        if (props.members.length == 0) {
            return <div>This group does not have any members.</div>;
        } else {
            return <ListOfUsers users={ [...props.members] } groupId={props.groupId}
            />;
        }
    }

    renderContent(props: Props) {
        return <div>
                <div className={ commonStyles.sectionTitle }>Current group members</div>
                { this.renderCurrent(props) }
            <div>
                <div className={ commonStyles.sectionTitle }>Add modelling group member</div>
                <AddMember members={ [...props.members.map(m=>m.username)] } users={props.users} groupId={props.groupId}/>
            </div>
        </div>
    }
}

export const GroupAdminContent = connectToStores(GroupAdminContentComponent);