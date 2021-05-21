import * as React from "react";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";

export interface ResponsibilityListItemProps {
    responsibility: AnnotatedResponsibility
    selectResponsibility: (responsibility: AnnotatedResponsibility) => void
}

export class ResponsibilityListItem extends React.Component<ResponsibilityListItemProps, undefined> {
    constructor(props: ResponsibilityListItemProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.props.selectResponsibility(this.props.responsibility);
    }

    render() {
        return <tr>
            <td>{this.props.responsibility.scenario.description}</td>
            <td>{this.props.responsibility.scenario.disease}</td>
            <td>{this.props.responsibility.status}</td>
            <td>{this.props.responsibility.current_estimate_set ? this.props.responsibility.current_estimate_set.uploaded_on : "None"}</td>
            <td>
                <div style={{
                    display: "table-cell",
                    width: "100%",
                    maxWidth: "20em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }} title={this.props.responsibility.comment && this.props.responsibility.comment.comment}>
                    {this.props.responsibility.comment && this.props.responsibility.comment.comment}
                </div>
                <div style={{display: "table-cell", textAlign: "right"}}>
                    <a href="#" className="small" style={{marginLeft: "2em"}} onClick={this.handleClick}>Edit</a>
                </div>
            </td>
        </tr>;
    }
}
