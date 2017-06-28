import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import {userStore} from "../../../stores/UserStore";
import {UsersList} from "./UsersList";

export class ViewAllUsersPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        setTimeout(() => {
            userStore.fetchUsers().catch(doNothing);
        });
    }

    title() {
        return <span>Users</span>
    }

    renderPageContent() {
        return <UsersList />;
    }
}