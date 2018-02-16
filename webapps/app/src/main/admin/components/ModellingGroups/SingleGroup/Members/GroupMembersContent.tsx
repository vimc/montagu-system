import * as React from "react";
import { connect } from 'react-redux';

import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import {  User } from "../../../../../shared/models/Generated";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { userStore } from "../../../../stores/UserStore";
import { ListOfUsers } from "../../ListOfUsers";
import { AddMember } from "./AddMember";

import "../../../../../shared/styles/common.scss";
import {AdminAppState} from "../../../../reducers/adminAppReducers";

interface Props extends RemoteContent {
    members: User[];
    users: User[];
    groupId: string;
    canManageGroupMembers: boolean;
}

export class GroupMembersContentComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return [ groupStore, userStore ];
    }

    static getPropsFromStores(): Partial<Props> {
        const group = groupStore.getCurrentGroupDetails();
        const allUsers = userStore.getState().users;
        const members = groupStore.getCurrentGroupMembers();

        if (group != null) {
            return {
                users: allUsers,
                members: members.map(a => allUsers.find(u => a == u.username)),
                ready: group != null && userStore.getState().ready,
                groupId: group.id,
            };
        } else {
            return {
                users: [],
                members: [],
                ready: false,
                groupId: "",
            };
        }
    }

    renderCurrent(props: Props): JSX.Element {
        if (props.members.length == 0) {
            return <div>This group does not have any members.</div>;
        } else {
            return <ListOfUsers users={ [...props.members] } groupId={props.groupId} />;
        }
    }

    renderContent(props: Props) {

        const addMembers = props.canManageGroupMembers ?
            <div>
                <div className="sectionTitle">Add modelling group member</div>
                <AddMember members={ [...props.members.map(m=>m.username)] } users={props.users} groupId={props.groupId}/>
            </div>
            : "";

        return <div>
                <div className="sectionTitle">Current group members</div>
                { this.renderCurrent(props) }
                {addMembers}
        </div>
    }
}

export const GroupMembersContentAltWrapped = connectToStores(GroupMembersContentComponent);

export const mapStateToProps = (state: AdminAppState) :Partial<Props> => {
    return {
        canManageGroupMembers: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1,
    }
};

export const GroupMembersContent = connect(mapStateToProps)(GroupMembersContentAltWrapped);