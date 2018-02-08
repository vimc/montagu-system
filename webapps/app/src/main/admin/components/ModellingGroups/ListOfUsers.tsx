import * as React from "react";
import { connect } from 'react-redux';

import { User } from "../../../shared/models/Generated";
import { DeletableUser } from "./DeletableUser";

interface Props {
    users: User[];
    groupId: string;
    isAdmin: boolean;
}

export class ListOfUsersComponent extends React.Component<Props, undefined> {

    render() {
        const users = this.props.users.sort((a, b) => a.name.localeCompare(b.name));
        return <div>{this.renderUsers(users, this.props.isAdmin)}</div>;
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

const mapStateToProps = (state: any) => {
    return {
        isAdmin: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1 ? true: false,
    }
};

export const ListOfUsers = connect(mapStateToProps)(ListOfUsersComponent);