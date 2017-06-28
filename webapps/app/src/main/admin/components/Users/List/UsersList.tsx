import * as React from "react";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { connectToStores } from "../../../../shared/alt";
import {userStore} from "../../../stores/UserStore";
import {User} from "../../../../shared/models/Generated";
import {UserListItem} from "./UserListItem";

interface UserProps extends RemoteContent {
    users: User[]
}

export class UsersListComponent extends
RemoteContentComponent<UserProps> {
static getStores() {
        return [ userStore ];
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
            .map(g => <li key={ g.username }>
            <UserListItem {...g} />
        </li>);
        return <ul>
            { items }
        </ul>;
    }
}

export const UsersList = connectToStores(UsersListComponent);