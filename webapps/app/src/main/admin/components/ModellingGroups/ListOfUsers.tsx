import * as React from "react";
import { connect } from 'react-redux';

import { User } from "../../../shared/models/Generated";
import { DeletableUser } from "./DeletableUser";
// import { adminAuthStore } from "../../stores/AdminAuthStore";

interface Props {
    users: User[];
    groupId: string;
    isAdmin: boolean;
}

export class ListOfUsersComponent extends React.Component<Props, undefined> {

    render() {
        return <div>{this.props.users.map(a => <DeletableUser key={a.username} user={a} groupId={this.props.groupId}
                                                              showDelete={this.props.isAdmin}/>)}
        </div>;
    }
}

const mapStateToProps = (state: any) => {
    return {
        isAdmin: state.auth.permissions.indexOf("*/modelling-groups.manage-members") > -1 ? true: false,
    }
};

export const ListOfUsers = connect(mapStateToProps)(ListOfUsersComponent);