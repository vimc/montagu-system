import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Touchstone, User} from "../../../../shared/models/Generated";

export class TouchstoneListItem extends React.Component<Touchstone, undefined> {
    render() {

        const touchstoneUrl = `/touchstones/${this.props.id}/`;

        let latestVersionUrl = "", latestVersionId = "";
        if (this.props.versions.length > 0) {
            // The API is guaranteed to return versions in descending order
            latestVersionId = this.props.versions[0].id;
            latestVersionUrl = `/touchstones/${this.props.id}/${latestVersionId}/`;
        }

        return <tr>
            <td>{this.props.id}</td>
            <td><InternalLink href={touchstoneUrl}>{this.props.description}</InternalLink></td>
            <td>{this.props.comment}</td>
            <td>{latestVersionId && <InternalLink href={latestVersionUrl}>{latestVersionId}</InternalLink>}</td>
        </tr>;
    }
}