import * as React from "react";
import { AssociateRole } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userActions } from "../../../actions/UserActions";
import { processResponseAndNotifyOnErrors } from "../../../../shared/sources/Source";
import { notificationActions, NotificationException } from "../../../../shared/actions/NotificationActions";

export interface RolesProps {
    username: string;
    userRoles: string[];
}

interface RolesState {
    allRoles: string[];
    availableRoles: string[];
    selectedRole: string;
}

export class AddRoles extends React.Component<RolesProps, RolesState> {

    componentWillMount() {

        this.setState({
            allRoles: [],
            availableRoles: [],
            selectedRole: ""
        });

        fetcher.fetcher.fetch("/users/roles/all/")
            .then((response: Response) => {
                processResponseAndNotifyOnErrors(response)
                    .then((result: string[]) => {

                        this.setState({
                            allRoles: result
                        });

                        this.componentWillReceiveProps(this.props);
                    })
                    .catch((e: NotificationException) => notificationActions.notify(e))
            });
    }

    componentWillReceiveProps(props: RolesProps) {

        const roles = this.state.allRoles.filter(r => props.userRoles.indexOf(r) == -1);
        this.setState({
            availableRoles: roles,
            selectedRole: roles.length > 0 ? roles[0] : ""
        })
    }

    handleChange(e: any) {

        this.setState({
            selectedRole: e.target.value
        });
    }

    handleClick(e: any) {

        e.preventDefault();

        const href = `/users/${this.props.username}/actions/associate_role/`;
        const associateRole: AssociateRole = {
            name: this.state.selectedRole,
            action: "add",
            scope_prefix: null,
            scope_id: null

        };

        const selectedRole = this.state.selectedRole;

        fetcher.fetcher.fetch(href, {
            method: "post",
            body: JSON.stringify(associateRole)
        }).then((response: Response) => {
            processResponseAndNotifyOnErrors(response)
                .then(() => userActions.addRole(selectedRole, null, null))
                .catch((e: NotificationException) => notificationActions.notify(e))
        })

    }

    render() {

        if (this.state.availableRoles.length == 0) {
            return <div className="form-group row">
                <div className="col">
                    <div className="alert alert-warning">
                        This user has all possible roles.
                    </div>
                </div>
            </div>
        }

        return <form>
            <div className="form-group row">
                <div className="col">
                    <select className="form-control" onChange={this.handleChange.bind(this)}>
                        {this.state.availableRoles
                            .map(r => <option value={r} key={r}>{r}</option>)}
                    </select>
                </div>
                <div className="col">
                    <button className="btn-success" onClick={this.handleClick.bind(this)}>Add role</button>
                </div>
            </div>
        </form>;
    }
}