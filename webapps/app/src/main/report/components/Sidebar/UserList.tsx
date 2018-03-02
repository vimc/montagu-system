import * as React from "react"
import {User} from "../../../shared/models/Generated";

export interface UserListProps {
    users: User[]
}

export const UserList = (props: UserListProps) => {
    return <ul className={"list-unstyled"}>
        {props.users.map(u => <UserListItem key={u.username} {...u} />)}
    </ul>

};

const UserListItem = (user: User) => {
    return <li>{user.username}</li>
};