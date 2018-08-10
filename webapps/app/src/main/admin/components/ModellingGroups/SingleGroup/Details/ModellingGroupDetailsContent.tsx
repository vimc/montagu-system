import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";

import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { ModellingGroupDetailsMembers } from "./ModellingGroupDetailsMembers";

import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";

interface ModellingGroupDetailsContentProps {
    group: ModellingGroupDetails;
    members: User[];
    canManageGroupMembers: boolean;
}

export const ModellingGroupDetailsContentComponent: React.SFC<ModellingGroupDetailsContentProps> = (props: ModellingGroupDetailsContentProps) => {
    return <div className="col">
        <table className="specialColumn">
            <tbody>
                <tr><td>ID</td><td>{ props.group.id }</td></tr>
                <tr>
                    <td>Group members</td>
                    <td><ModellingGroupDetailsMembers
                        group={props.group}
                        members={props.members}
                        canEdit={props.canManageGroupMembers}
                    /></td>
                </tr>
            </tbody>
        </table>
    </div>;
};

const mapStateToProps = (state: AdminAppState) :Partial<ModellingGroupDetailsContentProps> => {
    return {
        group: state.groups.currentGroupDetails,
        members: state.groups.currentGroupMembers,
        canManageGroupMembers: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1
    }
};

export const ModellingGroupDetailsContent = compose(
    connect(mapStateToProps),
    branch((props: ModellingGroupDetailsContentProps) => !props.group, renderComponent(LoadingElement))
)(ModellingGroupDetailsContentComponent);
