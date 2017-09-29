import * as React from "react";
import { AssociateUser, User } from "../../../../../shared/models/Generated";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import fetcher from "../../../../../shared/sources/Fetcher";

interface Props {
    members: Set<User>;
    users: User[];
    groupId: string;
}

interface State{
    selectedUser: string;
}

export class AddMember extends React.Component<Props, State> {

    handleClick() {

        const href = `/modelling-groups/${this.props.groupId}/actions/associate_user/`;
        const associateUser: AssociateUser = {
            username: this.state.selectedUser,
            action: "add"

        };

        fetcher.fetcher.fetch(href, {
            method: "post",
            body: JSON.stringify(associateUser)
        }).then(() => modellingGroupActions.addMember(this.state.selectedUser));
    }

    render() {
        const options = this.props.users.filter(x => !this.props.members.has(x))
            .map(u => <option key={ u.username } value={ u.username }>{ u.name }</option>);
        const select = {
            width: 300,
            height: 32
        };
        const button = {
            marginLeft: 10
        };
        return <div>
            <select style={ select }>{ options }</select>
            <button style={ button } onClick={this.handleClick.bind(this)}>Add</button>
        </div>;
    }

}