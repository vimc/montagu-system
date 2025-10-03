import * as React from "react";
import { connect } from "react-redux";
import { orderBy } from "lodash";

import { User } from "../../../../../shared/models/APITypes";
import { ModellingGroupMembersDeletableUser } from "./ModellingGroupMembersDeletableUser";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {isNonEmptyArray} from "../../../../../shared/ArrayHelpers";

interface ModellingGroupMembersListProps {
    users: User[];
    groupId: string;
    isAdmin: boolean;
}

export const ModellingGroupMembersListComponent: React.FunctionComponent<ModellingGroupMembersListProps> = (props:ModellingGroupMembersListProps) => {
    if (!props || !isNonEmptyArray(props.users)) {
        return <div>This group does not have any members.</div>;
    } else {
        return <div>
            {props.users.map((user: User) => <ModellingGroupMembersDeletableUser
                key={user.username}
                user={user}
                groupId={props.groupId}
                showDelete={props.isAdmin}
            />)}
        </div>;
    }
};

// TODO: move that logic to reselect if logic becomes more complex
const mapSortUsers = (users: User[]) => {
    if (!isNonEmptyArray(users)) {
        return [];
    }
    return orderBy(users, ['name'], ['asc']);
};

const mapStateToProps = (state: AdminAppState, props: Partial<ModellingGroupMembersListProps>) :Partial<ModellingGroupMembersListProps> => {
    return {
        isAdmin: state.auth.canManageGroupMembers,
        users: mapSortUsers(props.users),
        groupId: props.groupId
    }
};

export const ModellingGroupMembersList = connect(mapStateToProps)(ModellingGroupMembersListComponent) as
    React.ComponentClass<Partial<ModellingGroupMembersListProps>>;
