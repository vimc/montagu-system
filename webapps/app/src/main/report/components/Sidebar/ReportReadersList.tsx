import * as React from "react"
import {User} from "../../../shared/models/Generated";

export interface ReportReadersListProps {
    users: User[]
}

export const ReportReadersList = (props: ReportReadersListProps) => {
    return <ul className={"list-unstyled"}>
        {props.users.sort((a, b) => a.username < b.username ? -1 : 1)
            .map(u => <ReportReader key={u.username} {...u} />)}
    </ul>

};

export const ReportReader = (user: User) => {
    return <li>{user.username}</li>
};