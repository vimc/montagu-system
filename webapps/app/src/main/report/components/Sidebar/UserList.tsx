import * as React from "react"
import {User} from "../../../shared/models/Generated";
import {Link} from "simple-react-router";

export interface UserListProps {
    users: User[],
    report: string,
    removeReportReader: (username: string) => void
}

export interface UserProps {
    user: User,
    removeReportReader: (username: string) => void
}

export const UserList = (props: UserListProps) => {

    return <ul className={"list-unstyled report-readers"}>
        {props.users.map(u => <UserListItem key={u.username} user={u} removeReportReader={props.removeReportReader}/>)}
    </ul>

};

const UserListItem = (props: UserProps) => {

    const showDelete =
        props.user.roles.filter(r => r.name == "reports-reader" && r.scope_id == null).length == 0;

    return <li><span>{props.user.username}</span> {showDelete &&
    <Link onClick={() => props.removeReportReader(props.user.username)}
          className="text-danger d-inline-block ml-2 large" href="#">&times;</Link>}</li>
};