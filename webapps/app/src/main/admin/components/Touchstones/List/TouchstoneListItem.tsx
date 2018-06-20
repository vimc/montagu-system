import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Touchstone, User} from "../../../../shared/models/Generated";

export class TouchstoneListItem extends React.Component<Touchstone, undefined> {
    render() {
        // The API is guaranteed to return versions in descending order
        const latestVersion = this.props.versions[0];
        const url = `/touchstones/${this.props.id}/`;
        return <tr>
            <td>{this.props.id}</td>
            <td><InternalLink href={url}>{this.props.description}</InternalLink></td>
            <td>{this.props.comment}</td>
            <td className="latestVersionId">{latestVersion.id}</td>
        </tr>;
    }
}