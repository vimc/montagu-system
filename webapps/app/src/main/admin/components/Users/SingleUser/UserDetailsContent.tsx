import * as React from "react";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import {User} from "../../../../shared/models/Generated";
import {UserRole} from "./UserRoleComponent";
import {userStore} from "../../../stores/UserStore";
interface Props extends RemoteContent {
    user: User;
}

const commonStyles = require("../../../../shared/styles/common.css");

export class UserDetailsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [userStore];
    }

    static getPropsFromStores(): Props {
        const user = userStore.getCurrentUserDetails();
        return {
            user: user,
            ready: user != null
        };
    }

    renderContent(props: Props) {

        let roles;
        if (props.user.roles != null)
            roles =
                <tr>
                    <td>Roles</td>
                    <td>
                        {props.user.roles
                            .map(r =>
                                <UserRole key={ r.name + r.scope_prefix + r.scope_id } {...r} />)}
                    </td>
                </tr>;

        return <table className={ commonStyles.specialColumn }>
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>{ props.user.username }</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{ props.user.email }</td>
                        </tr>
                        { roles }
                    </tbody>
                </table>
    }
}

export const UserDetailsContent =
    connectToStores(UserDetailsContentComponent);