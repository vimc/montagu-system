import * as React from "react";
import {InternalLink} from "../../../shared/components/InternalLink";
import { VersionName} from "../../../shared/models/reports/Report";

export class VersionListItem extends React.Component<VersionName, undefined> {
    render() {
        const url = `/${ this.props.report}/${ this.props.version }/`;
        return <li><InternalLink href={ url }>{ this.props.version }</InternalLink></li>;
    }
}