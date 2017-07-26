import * as React from "react";
import {InternalLink} from "../../../shared/components/InternalLink";
import {ReportName} from "../../../shared/models/reports/Report";

export class ReportListItem extends React.Component<ReportName, undefined> {
    render() {
        const url = `/${ this.props.name }/`;
        return <li><InternalLink href={ url }>{ this.props.name }</InternalLink></li>;
    }
}