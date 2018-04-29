import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {compose} from "recompose";

import { User } from "../../../shared/models/Generated";
import { InternalLink } from "../../../shared/components/InternalLink";
import {modellingGroupsActionCreators} from "../../actions/modellingGroupsActionCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";

export interface DeletableUserProps {
    user: User;
    groupId: string;
    showDelete: boolean;
    removeUserFromGroup: (groupId: string, username: string) => void;
}

export class DeletableUserComponent extends React.Component<DeletableUserProps, undefined> {

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

export const mapStateToProps = (state: AdminAppState, props: Partial<DeletableUserProps>) :Partial<DeletableUserProps> => {
    return {
        user: props.user,
        groupId: props.groupId,
        showDelete: props.showDelete
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<DeletableUserProps> => {
    return {
        removeUserFromGroup: (groupId: string, username: string) => dispatch(modellingGroupsActionCreators.removeUserFromGroup(groupId, username))
    }
};

export const DeletableUser = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(DeletableUserComponent) as React.ComponentClass<Partial<DeletableUserProps>>;