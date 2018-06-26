import {TouchstoneVersion} from "../../../../shared/models/Generated";
import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";

export class TouchstoneVersionItem extends React.Component<TouchstoneVersion, undefined> {
    render() {
        const version = this.props;
        const url = `/touchstones/${version.name}/${version.id}/responsibilities/`;
        return <tr>
            <td>{version.version}</td>
            <td>{version.id}</td>
            <td><InternalLink href={url}>{version.description}</InternalLink></td>
            <td>{version.status}</td>
        </tr>;
    }
}