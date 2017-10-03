import { User } from "../../../shared/models/Generated";
import * as React from "react";
import { DeletableUser } from "./DeletableUser";

interface Props {
    users: User[];
    groupId: string;
}

export class ListOfUsers extends React.Component<Props, undefined> {
    render() {
        return <div>{this.props.users.map(a => <DeletableUser key={a.username} user={a} groupId={this.props.groupId}/>)}
        </div>;
    }
}