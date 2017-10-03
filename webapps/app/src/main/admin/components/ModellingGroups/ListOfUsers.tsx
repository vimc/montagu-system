import { User } from "../../../shared/models/Generated";
import * as React from "react";
import { DeletableUser } from "./DeletableUser";
import { adminAuthStore } from "../../stores/AdminAuthStore";

interface Props {
    users: User[];
    groupId: string;
}

export class ListOfUsers extends React.Component<Props, undefined> {

    render() {
        const isAdmin = adminAuthStore.getState().permissions.indexOf("*/modelling-groups.manage-members") > -1;

        return <div>{this.props.users.map(a => <DeletableUser key={a.username} user={a} groupId={this.props.groupId}
                                                              showDelete={isAdmin}/>)}
        </div>;
    }
}