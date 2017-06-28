import * as React from "react";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {connectToStores} from "../../../../shared/alt";
import {userStore} from "../../../stores/UserStore";
import {User} from "../../../../shared/models/Generated";
import {UserListItem} from "./UserListItem";

interface UserProps extends RemoteContent {
    users: User[]
}

export class UsersListComponent extends RemoteContentComponent<UserProps> {
    static getStores() {
        return [userStore];
    }

    static getPropsFromStores(): UserProps {
        const s = userStore.getState();
        return {
            users: s.users,
            ready: s.ready
        };
    }

    renderContent(props: UserProps) {
        const items = props.users
            .sort((a, b) => a.username.localeCompare(b.username))
            .map(g =>
                <UserListItem {...g} />);
        return <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Last logged in</th>
            </tr>
            </thead>
            <tbody>
                { items }
            </tbody>
        </table>;
    }
}

export const UsersList = connectToStores(UsersListComponent);