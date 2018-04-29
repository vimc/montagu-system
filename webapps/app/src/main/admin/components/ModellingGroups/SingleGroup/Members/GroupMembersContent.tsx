import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";

import {  User } from "../../../../../shared/models/Generated";
import { ListOfUsers } from "../../ListOfUsers";
import { AddMember } from "./AddMember";

import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";

export interface GroupMembersListProps {
    members: User[];
    groupId: string;
}
export const GroupMembersListComponent: React.SFC<GroupMembersListProps> = (props: GroupMembersListProps) => {
    if (props.members.length == 0) {
        return <div>This group does not have any members.</div>;
    } else {
        return <ListOfUsers users={ [...props.members] } groupId={props.groupId} />;
    }
}

export interface AddGroupMembersProps {
    canManageGroupMembers: boolean;
    members: User[];
    users: User[];
    groupId: string;
}
export const AddGroupMembersComponent: React.SFC<AddGroupMembersProps> = (props: AddGroupMembersProps) => {
    return props.canManageGroupMembers ?
        <div>
            <div className="sectionTitle">Add modelling group member</div>
            <AddMember members={ [...props.members.map(m=>m.username)] } users={props.users} groupId={props.groupId}/>
        </div>
    : null;
}


export interface GroupMembersContentProps {
    members: User[];
    users: User[];
    groupId: string;
    canManageGroupMembers: boolean;
}
export const GroupMembersContentComponent: React.SFC<GroupMembersContentProps> = (props: GroupMembersContentProps) => {
    return <div>
        <div className="sectionTitle">Current group members</div>
        <GroupMembersListComponent members={props.members} groupId={props.groupId}/>
        <AddGroupMembersComponent
            members={props.members} groupId={props.groupId} canManageGroupMembers={props.canManageGroupMembers} users={props.users}
        />
    </div>;
};

export const mapStateToProps = (state: AdminAppState) :Partial<GroupMembersContentProps> => {
    return {
        canManageGroupMembers: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1,
        groupId: state.groups.currentGroupDetails ? state.groups.currentGroupDetails.id : null,
        users: state.users.users,
        members: []
    }
};

export const GroupMembersContent = compose(
    connect(mapStateToProps),
    branch((props: GroupMembersContentProps) => !props.groupId, renderComponent(LoadingElement))
)(GroupMembersContentComponent);