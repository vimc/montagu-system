import * as React from "react";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import {User} from "../../../../shared/models/Generated";
import {userStore} from "../../../../../../../contrib/src/main/admin/stores/UserStore";
import {UserRole} from "./UserRoleComponent";

interface Props extends RemoteContent {
    user: User;
}

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
                <ul>
                    {props.user.roles
                        .map(r =>
                            <UserRole key={ r.name + r.scope_prefix + r.scope_id } {...r} />)}
                </ul>;
        return <ul>
            <li>{ props.user.username }</li>
            <li>{ props.user.name }</li>
            <li>{ props.user.email }</li>
            { roles }
        </ul>
    }
}

export const UserDetailsContent =
    connectToStores(UserDetailsContentComponent);