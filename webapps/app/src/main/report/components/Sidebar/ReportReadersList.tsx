import * as React from "react"
import {ChangeEvent} from "react"
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

export class ReportReadersList extends React.Component<ReportReadersListProps, ReportReadersListState> {

    constructor() {
        super();
        this.state = {newReader: ""};
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({newReader: e.target.value});
    }

    onSubmit() {
        this.props.addReportReader(this.state.newReader);
        this.setState({newReader: ""});
    }

    render() {
        return <div>
            <div className="input-group mb-3">
                <input className={"form-control form-control-sm"} type={"text"} placeholder={"username"}
                       value={this.state.newReader} onChange={this.onChange}/>
                <div className="input-group-append">
                    <button type={"submit"} onClick={this.onSubmit}
                            className="btn btn-sm">Add reader
                    </button>
                </div>
            </div>
            <ul className={"list-unstyled report-readers"}>
                {this.props.users.sort((a, b) => a.username < b.username ? -1 : 1)
                    .map(u => <ReportReader key={u.username} user={u}
                                            removeReportReader={this.props.removeReportReader}/>)}
            </ul>
        </div>
    }
}

export const ReportReader = (props: ReportReaderProps) => {
    const showDelete =
        props.user.roles.filter(r => r.name == "reports-reader" && r.scope_id == null).length == 0;

    return <li><span>{props.user.name}</span> {showDelete &&
    <Link onClick={() => props.removeReportReader(props.user.username)}
          className="text-danger d-inline-block ml-2 large" to="#">&times;</Link>}
        <div className={"text-muted small"} style={{marginTop: "-1rem"}}>{props.user.username}</div>
    </li>
};
