import * as React from "react";
import { AssociateRole, RoleAssignment } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userStore } from "../../../stores/UserStore";

const buttonStyles = require("../../../../shared/styles/buttons.css");

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

    clickHandler() {
        fetcher.fetcher.fetch(this.state.href, {
            method: "post",
            body: JSON.stringify(this.state.associateRole)
        }).then(userStore.fetchUsers(true))
    }

    renderButton() {
        return <button ref="link" className={buttonStyles.delete} onClick={this.clickHandler.bind(this)}>
            Remove role</button>;
    }

    render() {
        let scope = "";
        if (this.props.scope_prefix && this.props.scope_prefix.length > 0) {
            scope = " / " + this.props.scope_prefix + ":" + this.props.scope_id;
        }

        return <div>
            {this.props.name} {scope} {this.renderButton()}
        </div>

    }
}
