import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";

import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { GroupMembersSummary } from "./GroupMembersSummary";

import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";

interface ModellingGroupDetailsContentProps {
    group: ModellingGroupDetails;
    users: User[];
    canManageGroupMembers: boolean;
}

export const ModellingGroupDetailsContentComponent: React.SFC<ModellingGroupDetailsContentProps> = (props: ModellingGroupDetailsContentProps) => {
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
    </div>;
}


const mapStateToProps = (state: AdminAppState) :Partial<ModellingGroupDetailsContentProps> => {
    return {
        group: state.groups.currentGroupDetails,
        users: state.users.users,
        canManageGroupMembers: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1
    }
};

export const ModellingGroupDetailsContent = compose(
    connect(mapStateToProps),
    branch((props: ModellingGroupDetailsContentProps) => !props.group, renderComponent(LoadingElement))
)(ModellingGroupDetailsContentComponent)
