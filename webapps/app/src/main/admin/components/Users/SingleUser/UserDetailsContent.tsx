import * as React from "react";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { connectToStores } from "../../../../shared/alt";
import { RoleAssignment, User } from "../../../../shared/models/Generated";
import { UserRole } from "./UserRoleComponent";
import { userStore } from "../../../stores/UserStore";
import { AddRoles } from "./AddRoles";
import { adminAuthStore } from "../../../stores/AdminAuthStore";

interface Props extends RemoteContent {
    user: User;
    roles: RoleAssignment[];
}

import "../../../../shared/styles/common.scss";

export class UserDetailsContentComponent extends RemoteContentComponent<Props, undefined> {
    static getStores() {
        return [userStore];
    }

    static getPropsFromStores(): Props {
        const user = userStore.getCurrentUserDetails();

        return {
            user: user,
            ready: user != null,
            roles: userStore.getCurrentUserRoles()
        };
    }

    roles(username: string) {

        const isAdmin = adminAuthStore.getState().permissions.indexOf("*/roles.write") > -1;
        const addRoles = isAdmin ?
            <AddRoles userRoles={this.props.roles.filter(r => r.scope_prefix == null).map(r => r.name)}
                   username={this.props.user.username}/>
        : "";

        return <div className="mt-4">
            <h3>Manage roles</h3>
            <form className="form">
                <hr/>
                {this.props.roles.map(r =>
                    <UserRole key={r.name + r.scope_prefix + r.scope_id} {...r} username={username} showdelete={isAdmin}/>
                )}
            </form>
            {addRoles}
        </div>;
    }

    renderContent(props: Props) {

        let roles;
        if (props.roles != null) {
            roles = this.roles(props.user.username)
        }

        return <div className="col-xs-12 col-lg-8">
            <table className="specialColumn table table-responsive">
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
            <div>
                {roles}
            </div>
        </div>
    }
}

export const UserDetailsContent =
    connectToStores(UserDetailsContentComponent);