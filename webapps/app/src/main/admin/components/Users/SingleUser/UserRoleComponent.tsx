import * as React from "react";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {connectToStores} from "../../../../shared/alt";
import {RoleAssignment} from "../../../../shared/models/Generated";

export class UserRole extends React.Component<RoleAssignment, undefined> {

    render() {
        return <ul>
                <li>
                    { this.props.name } / { this.props.scope_prefix} : {this.props.scope_id}
                </li>
            </ul>
    }
}