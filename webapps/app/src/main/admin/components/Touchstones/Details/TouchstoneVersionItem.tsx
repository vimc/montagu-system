import {TouchstoneVersion} from "../../../../shared/models/Generated";
import * as React from "react";

export class TouchstoneVersionItem extends React.Component<TouchstoneVersion, undefined> {
    render() {
        const version = this.props;
        return <tr>
            <td>{version.version}</td>
            <td>{version.id}</td>
            <td>{version.description}</td>
            <td>{version.status}</td>
        </tr>;
    }
}