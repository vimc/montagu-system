import * as React from "react"
import {User} from "../../../shared/models/Generated";
import {Link} from "react-router-dom";

export interface ReportReadersListProps {
    users: User[],
    report: string,
    removeReportReader: (username: string) => void
    addReportReader: (username: string) => void
}

export interface ReportReaderProps {
    user: User,
    removeReportReader: (username: string) => void
}

interface ReportReadersListState {
    newReader: string;
}

export const ReportReadersList = (props: ReportReadersListProps, state: ReportReadersListState) => {
    return <div>
        <ul className={"list-unstyled report-readers"}>
            {props.users.sort((a, b) => a.username < b.username ? -1 : 1)
                .map(u => <ReportReader key={u.username} user={u} removeReportReader={props.removeReportReader}/>)}
        </ul>
        <div className="input-group">
            <input className={"form-control form-control-sm"} type={"text"} placeholder={"username"}/>
            <div className="input-group-append">
                <button type={"submit"} onClick={() => props.addReportReader("alex.hill")}
                        className="btn btn-sm">Add reader
                </button>
            </div>
        </div>
    </div>

};

export const ReportReader = (props: ReportReaderProps) => {
    const showDelete =
        props.user.roles.filter(r => r.name == "reports-reader" && r.scope_id == null).length == 0;

    return <li><span>{props.user.name}</span> {showDelete &&
    <Link onClick={() => props.removeReportReader(props.user.username)}
          className="text-danger d-inline-block ml-2 large" to="#">&times;</Link>}
        <div className={"text-muted small"} style={{marginTop: "-1rem"}}>{props.user.username}</div>
    </li>
};
