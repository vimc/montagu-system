import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";

import { User} from "../../../../../shared/models/APITypes";
import { ModellingGroupMembersList } from "./ModellingGroupMembersList";
import { ModellingGroupMembersAdd } from "./ModellingGroupMembersAdd";

import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";

export interface AddGroupMembersProps {
    canManageGroupMembers: boolean;
    members: User[];
    groupId: string;
}
export const AddGroupMembersComponent: React.FunctionComponent<AddGroupMembersProps> = (props: AddGroupMembersProps) => {
    return props.canManageGroupMembers ?
        <div>
            <div className="sectionTitle">Add modelling group member</div>
            <ModellingGroupMembersAdd members={ [...props.members.map(m=>m.username)] } groupId={props.groupId}/>
        </div>
    : null;
};


export interface ModellingGroupMembersContentProps {
    members: User[];
    users: User[];
    groupId: string;
    canManageGroupMembers: boolean;
}
export const ModellingGroupMembersContentComponent: React.FunctionComponent<ModellingGroupMembersContentProps> = (props: ModellingGroupMembersContentProps) => {
    return <div>
        <div className="sectionTitle">Current group members</div>
        <ModellingGroupMembersList users={props.members} groupId={props.groupId}/>
        <AddGroupMembersComponent
            members={props.members} groupId={props.groupId} canManageGroupMembers={props.canManageGroupMembers}
        />
    </div>;
};

export const mapStateToProps = (state: AdminAppState) :Partial<ModellingGroupMembersContentProps> => {
    return {
        canManageGroupMembers: state.auth.canManageGroupMembers,
        groupId: state.groups.currentGroupDetails ? state.groups.currentGroupDetails.id : null,
        users: state.users.users,
        members: state.groups.currentGroupMembers,
    }
};

export const ModellingGroupMembersContent = compose(
    connect(mapStateToProps),
    branch((props: ModellingGroupMembersContentProps) => !props.groupId || !props.users.length, renderComponent(LoadingElement))
)(ModellingGroupMembersContentComponent);
