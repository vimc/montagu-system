import * as React from "react";
import { AssociateUser, User } from "../../../../../shared/models/Generated";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import fetcher from "../../../../../shared/sources/Fetcher";
import { processResponseAndNotifyOnErrors } from "../../../../../shared/sources/Source";
import { notificationActions, NotificationException } from "../../../../../shared/actions/NotificationActions";

interface Props {
    members: string[];
    users: User[];
    groupId: string;
}

interface State {
    options: User[];
    selectedUser: string;
}

export class AddMember extends React.Component<Props, State> {

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: Props) {
        const options = props.users.filter(x => props.members.indexOf(x.username) == -1);
        const firstUser = options.length > 0 ? options[0].username : "";

        this.setState({
            selectedUser: firstUser,
            options: options
        })
    }

    handleChange(e: any) {

        this.setState({
            selectedUser: e.target.value
        });
    }

    handleClick(e: any) {

        e.preventDefault();

        const href = `/modelling-groups/${this.props.groupId}/actions/associate_member/`;
        const associateUser: AssociateUser = {
            username: this.state.selectedUser,
            action: "add"

        };

        fetcher.fetcher.fetch(href, {
            method: "post",
            body: JSON.stringify(associateUser)
        }).then((response: Response) => {
            return processResponseAndNotifyOnErrors(response)
                .then(() => {
                    modellingGroupActions.addMember(this.state.selectedUser)
                })
                .catch((e: NotificationException) => notificationActions.notify(e))
        });
    }

    render() {

        if (this.state.options.length == 0) {
            return <div className="form-group row">
                <div className="col">
                    <div className="alert alert-warning">
                        No more users available to add. Add more users to Montagu <a href="/users/">here</a>.
                    </div>
                </div>
            </div>
        }

        return <form>
            <div className="form-group row">
                <div className="col">
                    <select className="form-control" onChange={this.handleChange.bind(this)}>
                        {this.state.options
                            .map(u => <option key={"option-" + u.username} value={u.username}>{u.name}</option>)}
                    </select>
                </div>
                <div className="col">
                    <button className="btn-success" onClick={this.handleClick.bind(this)}>Add</button>
                </div>
            </div>
        </form>;
    }

}