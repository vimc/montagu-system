import * as React from "react";
import { AssociateRole, Result } from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import { userActions } from "../../../actions/UserActions";

export interface RolesProps {
    username: string;
    userRoles: string[];
}

interface RolesState {
    roles: string[];
    selectedRole: string;
}

export class Roles extends React.Component<RolesProps, RolesState> {


    componentDidMount() {

        fetcher.fetcher.fetch("/users/roles/all/")
            .then((response: Response) => {
                return response.json()
            })
            .then((result: Result) => {
                this.setState({
                    roles: result.data
                })
            });
    }

    componentWillMount() {

        this.setState({
            roles: [],
            selectedRole: ""
        })
    }

    handleChange(e: any) {
        this.setState({
            selectedRole: e.target.value
        });
    }

    handleClick() {
        const href = `/users/${this.props.username}/actions/associate_role/`;
        const associateRole: AssociateRole = {
            name: this.state.selectedRole,
            action: "add",
            scope_prefix: null,
            scope_id: null

        };

        fetcher.fetcher.fetch(href, {
            method: "post",
            body: JSON.stringify(associateRole)
        }).then(() => userActions.addRole(this.state.selectedRole, null, null));
    }

    render() {

        return <form>
            <div className="form-group row">
                <div className="col">
                    <select className="form-control" onChange={this.handleChange.bind(this)}>
                        {this.state.roles.filter(r => this.props.userRoles.indexOf(r) == -1)
                            .map(r => <option value={r} key={r}>{r}</option>)}
                    </select>
                </div>
                <div className="col">
                    <button type="submit" onClick={this.handleClick.bind(this)}>Add role</button>
                </div>
            </div>
        </form>;
    }
}