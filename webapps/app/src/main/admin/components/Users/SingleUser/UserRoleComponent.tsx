import * as React from "react";
import { AssociateRole, RoleAssignment } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userActions } from "../../../actions/UserActions";
import { processResponseAndNotifyOnErrors } from "../../../../shared/sources/Source";
import { notificationActions, NotificationException } from "../../../../shared/actions/NotificationActions";
import { Link } from "simple-react-router";

interface UserRoleProps extends RoleAssignment {
    username: string;
    showdelete: boolean;
}

interface UserRoleState {
    href: string;
    associateRole: AssociateRole
}

export class UserRole extends React.Component<UserRoleProps, UserRoleState> {

    componentWillMount() {
        this.setState({
            href: `/users/${this.props.username}/actions/associate-role/`,
            associateRole: {
                action: "remove",
                name: this.props.name,
                scope_id: this.props.scope_id,
                scope_prefix: this.props.scope_prefix
            }
        })
    }

    clickHandler() {
        const roleName = this.state.associateRole.name;

        fetcher.fetcher.fetch(this.state.href, {
            method: "post",
            body: JSON.stringify(this.state.associateRole)
        }).then((response: Response) =>
            processResponseAndNotifyOnErrors(response)
                .then(() => userActions.removeRole(roleName, null, null))
                .catch((e: NotificationException) => notificationActions.notify(e))
        )
    }

    renderButton() {
        if (!this.props.showdelete) {
            return ""
        }

        return <Link onClick={this.clickHandler.bind(this)} className="text-danger float-right" href="#">Remove role</Link>
    }

    render() {
        let scope = "";
        if (this.props.scope_prefix && this.props.scope_prefix.length > 0) {
            scope = " / " + this.props.scope_prefix + ":" + this.props.scope_id;
        }

        return <div>
            <div className="form-group">
                <span className="role-name">{this.props.name}{scope}</span>
                {this.renderButton()}
            </div>
            <hr className="dashed"/>
        </div>

    }
}
