import * as React from "react";
import {RoleAssignment} from "../../../../shared/models/Generated";

export class UserRole extends React.Component<RoleAssignment, undefined> {

    render() {
        let scope = "";
        if (this.props.scope_prefix && this.props.scope_prefix.length > 0)
            scope = " / " + this.props.scope_prefix + ":" + this.props.scope_id;

        return <div>
                { this.props.name }{ scope }
            </div>

    }
}