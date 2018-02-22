import * as React from "react";
import {InternalLink} from "../../../shared/components/InternalLink";
import {Report} from "../../../shared/models/Generated";

export class ReportListItem extends React.Component<Report, undefined> {
    render() {
        const url = `/${this.props.name}/${this.props.latest_version}/`;
        let name = this.props.name;
        if (this.props.display_name) {
            name = this.props.display_name;
        }

        return <li><InternalLink href={url}>{name}</InternalLink></li>;
    }
}