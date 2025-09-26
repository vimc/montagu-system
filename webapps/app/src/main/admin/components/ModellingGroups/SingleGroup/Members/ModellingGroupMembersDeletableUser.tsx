import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {compose} from "recompose";

import { User } from "../../../../../shared/models/Generated";
import { InternalLink } from "../../../../../shared/components/InternalLink";
import {modellingGroupsActionCreators} from "../../../../actions/modellingGroupsActionCreators";
import {AdminAppState} from "../../../../reducers/adminAppReducers";

export interface ModellingGroupMembersDeletableUserProps {
    user: User;
    groupId: string;
    showDelete: boolean;
    removeUserFromGroup: (groupId: string, username: string) => void;
}

export class ModellingGroupMembersDeletableUserComponent extends React.Component<ModellingGroupMembersDeletableUserProps, undefined> {

    clickHandler() {
        this.props.removeUserFromGroup(this.props.groupId, this.props.user.username);
    }

    render() {

        const deleteLink = this.props.showDelete
            ? <InternalLink
                onClick={this.clickHandler.bind(this)}
                className="text-danger float-right"
                href="#"
            >
                Remove member
            </InternalLink>
            : "";

        return <div>
            <div className="form-group">
                <InternalLink href={`/users/${this.props.user.username}/`}>
                    {this.props.user.name}
                </InternalLink>
                {deleteLink}
            </div>
            <hr className={"dashed"}/>
        </div>;
    }
}

export const mapStateToProps = (state: AdminAppState, props: Partial<ModellingGroupMembersDeletableUserProps>) :Partial<ModellingGroupMembersDeletableUserProps> => {
    return {
        user: props.user,
        groupId: props.groupId,
        showDelete: props.showDelete
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ModellingGroupMembersDeletableUserProps> => {
    return {
        removeUserFromGroup: (groupId: string, username: string) => dispatch(modellingGroupsActionCreators.removeUserFromGroup(groupId, username))
    }
};

export const ModellingGroupMembersDeletableUser = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModellingGroupMembersDeletableUserComponent) as React.ComponentClass<Partial<ModellingGroupMembersDeletableUserProps>>;