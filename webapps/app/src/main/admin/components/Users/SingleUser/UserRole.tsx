import * as React from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {compose} from "recompose";

import { RoleAssignment } from "../../../../shared/models/APITypes";
import { InternalLink } from "../../../../shared/components/InternalLink";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {usersActionCreators} from "../../../actions/usersActionCreators";

export interface UserRolePublicProps extends RoleAssignment {
    username: string;
    showdelete: boolean;
}

export interface UserRoleProps extends UserRolePublicProps {
    removeRoleFromUser: (username: string, role: string, scopeId: string, scopePrefix: string) => void;
}

export class UserRoleComponent extends React.Component<UserRoleProps> {
    clickHandler() {
        this.props.removeRoleFromUser(this.props.username, this.props.name, this.props.scope_id, this.props.scope_prefix);
    }

    render() {
        let scope = "";
        if (this.props.scope_prefix && this.props.scope_prefix.length > 0) {
            scope = " / " + this.props.scope_prefix + ":" + this.props.scope_id;
        }
        return <div>
            <div className="form-group">
                <span className="role-name">{this.props.name}{scope}</span>
                {this.props.showdelete &&
                <InternalLink onClick={this.clickHandler.bind(this)} className="text-danger float-right" href="#">
                    Remove role
                </InternalLink>
                }
            </div>
            <hr className={"dashed"}/>
        </div>
    }
}

const mapStateToProps = (state: AdminAppState, props: UserRolePublicProps): UserRolePublicProps => {
    return {...props}
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>, props: UserRolePublicProps): UserRoleProps => {
    return {
        ...props,
        removeRoleFromUser: (username: string, role: string, scopeId: string, scopePrefix: string) =>
            dispatch(usersActionCreators.removeRoleFromUser(username, role, scopeId, scopePrefix))
    }
};

export const UserRole = compose<UserRoleProps, UserRolePublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
)(UserRoleComponent);

