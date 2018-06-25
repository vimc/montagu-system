import {Responsibility} from "../../../../shared/models/Generated";
import * as React from "react";

interface ResponsibilityListProps {
    responsibilities: Responsibility[]
}

export class ResponsibilityListItem extends React.Component<Responsibility, undefined> {
    render() {
        return <tr>
            <td>{this.props.scenario.description}</td>
            <td>{this.props.scenario.disease}</td>
            <td>{this.props.status}</td>
            <td>{this.props.current_estimate_set ? this.props.current_estimate_set.uploaded_on: "None"}</td>
        </tr>;
    }
}

export const ResponsibilityList: React.SFC<ResponsibilityListProps> = (props: ResponsibilityListProps) => {
    return <table>
        <thead>
        <tr>
            <th>Scenario</th>
            <th>Disease</th>
            <th>Status</th>
            <th>Latest estimate set</th>
        </tr>
        </thead>
        <tbody>
        {props.responsibilities.map(r => <ResponsibilityListItem {...r} key={r.scenario.id}/>)}
        </tbody>
    </table>;
};