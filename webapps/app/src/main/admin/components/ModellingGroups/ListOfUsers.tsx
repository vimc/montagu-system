import {User} from "../../../shared/models/Generated";
import * as React from "react";
import {DeletableUser} from "./DeletableUser";
import {adminAuthStore} from "../../stores/AdminAuthStore";

interface Props {
    users: User[];
    groupId: string;
}

export class ListOfUsers extends React.Component<Props, undefined> {

    render() {
        const isAdmin = adminAuthStore.getState().permissions.indexOf("*/modelling-groups.manage-members") > -1;
        const users = this.props.users.sort((a, b) => a.name.localeCompare(b.name));
        return <div>{this.renderUsers(users, isAdmin)}</div>;
    }

    renderUsers(users: User[], isAdmin: boolean): JSX.Element[] {
        return users.map(a => {
            return <DeletableUser key={a.username}
                                  user={a}
                                  groupId={this.props.groupId}
                                  showDelete={isAdmin}
            />;
        });
    }
}