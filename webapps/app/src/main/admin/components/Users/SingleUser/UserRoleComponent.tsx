import * as React from "react";
import { AssociateRole, RoleAssignment } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userActions } from "../../../actions/UserActions";

interface UserRoleProps extends RoleAssignment {
    username: string;
}

interface UserRoleState {
    href: string;
    associateRole: AssociateRole
}

export class UserRole extends React.Component<UserRoleProps, UserRoleState> {

    componentWillMount() {
        this.setState((previousState, props) => ({
            href: `/users/${props.username}/actions/associate_role/`,
            associateRole: {
                action: "remove",
                name: props.name,
                scope_id: props.scope_id,
                scope_prefix: props.scope_prefix
            }
        }))
    }

    componentDidMount() {
        this.setState({
            href: `/users/${this.props.username}/actions/associate_role/`,
            associateRole: {
                action: "remove",
                name: this.props.name,
                scope_id: this.props.scope_id,
                scope_prefix: this.props.scope_prefix
            }
        })
    }

    clickHandler() {
        fetcher.fetcher.fetch(this.state.href, {
            method: "post",
            body: JSON.stringify(this.state.associateRole)
        }).then(() => userActions.removeRole(this.state.associateRole.name, null, null))
    }

    renderButton() {
        return <a href="#" className="text-danger float-right" onClick={this.clickHandler.bind(this)}>
            Remove role</a>;
    }

    render() {
        let scope = "";
        if (this.props.scope_prefix && this.props.scope_prefix.length > 0) {
            scope = " / " + this.props.scope_prefix + ":" + this.props.scope_id;
        }

        return <div><div className="form-group">
            <span className="role-name">{this.props.name}{scope}</span>
             {this.renderButton()}
        </div>
            <hr />
        </div>

    }
}
