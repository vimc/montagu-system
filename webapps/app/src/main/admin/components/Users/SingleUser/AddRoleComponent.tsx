import * as React from "react";
import { AssociateRole } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userStore } from "../../../stores/UserStore";

const buttonStyles = require("../../../../shared/styles/buttons.css");

interface AddRoleProps {
    username: string;
}

interface AddRoleState {
    href: string;
    role_name: string;
}

export class AddRole extends React.Component<AddRoleProps, AddRoleState> {

    componentWillMount() {
        this.setState((previousState, props) => ({
            href: `/users/${props.username}/actions/associate_role/`
        }))
    }

    clickHandler() {
        const associateRole: AssociateRole = {
            action: "add",
            name: this.state.role_name,
            scope_prefix: null,
            scope_id: null
        };

        fetcher.fetcher.fetch(this.state.href, {
            method: "post",
            body: JSON.stringify(associateRole)
        }).then(userStore.fetchUsers(true))
    }

    changeHandler(e: any) {
        this.setState({ role_name: e.target.value });
    }

    render() {
        return <div>
            <input type="text" onChange={this.changeHandler.bind(this)}/>
            <button type="submit" ref="link" onClick={this.clickHandler.bind(this)}>
                Add role
            </button>
        </div>;
    }
}
