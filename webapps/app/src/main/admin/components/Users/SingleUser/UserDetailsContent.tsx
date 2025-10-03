import * as React from "react";
import {connect} from 'react-redux';
import {branch, compose, renderComponent} from "recompose";

import {User} from "../../../../shared/models/APITypes";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {AddRoles} from "./AddRoles";
import {UserRole} from "./UserRole";

interface UserRolesProps {
    user: User
    canWriteRoles: boolean;
}

export const UserRoles: React.FunctionComponent<UserRolesProps> = (props: UserRolesProps) => {

    const user = props.user;
    return <div className="mt-4">
        <h3>Manage roles</h3>
        <form className="form">
            <hr className={"dashed"}/>
            {user.roles.map(r =>
                <UserRole
                    key={r.name + r.scope_prefix + r.scope_id}
                    {...r}
                    username={user.username}
                    showdelete={props.canWriteRoles}
                />
            )}
        </form>
        {props.canWriteRoles &&
        <AddRoles userRoles={user.roles.filter(r => r.scope_prefix == null).map(r => r.name)}
                  username={user.username}/>}
    </div>;
};

export interface UserDetailsProps {
    user: User;
    canReadRoles: boolean;
    canWriteRoles: boolean;
}

export const UserDetailsContentComponent: React.FunctionComponent<UserDetailsProps> = (props: UserDetailsProps) => {
    return <div className="col-xs-12 col-lg-8">
        <table className="specialColumn">
            <tbody>
            <tr>
                <td>Username</td>
                <td>{props.user.username}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{props.user.email}</td>
            </tr>
            <tr>
                <td>Last logged in</td>
                <td>{props.user.last_logged_in || "never"}</td>
            </tr>
            </tbody>
        </table>
        <div>{props.canReadRoles &&
        <UserRoles user={props.user} canWriteRoles={props.canWriteRoles}/>}
        </div>
    </div>;
};

export const mapStateToProps = (state: AdminAppState): UserDetailsProps => {
    return {
        canReadRoles: state.auth.canReadRoles,
        canWriteRoles: state.auth.canWriteRoles,
        user: state.users.currentUser,
    }
};

export const UserDetailsContent = compose(
    connect(mapStateToProps),
    branch((props: UserDetailsProps) => !props.user, renderComponent(LoadingElement))
)(UserDetailsContentComponent);
