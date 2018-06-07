import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Touchstone, User} from "../../../../shared/models/Generated";

export class TouchstoneListItem extends React.Component<Touchstone, undefined> {
    render() {
        const url = `/touchstones/${ this.props.name }/`;
        return <tr>
            <td>
                <InternalLink href={url}>{this.props.name}</InternalLink>
            </td>
            <td>{this.props.id}</td>
        </tr>;
    }
}