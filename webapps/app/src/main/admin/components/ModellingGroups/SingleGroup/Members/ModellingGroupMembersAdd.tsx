import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { User } from "../../../../../shared/models/APITypes";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {modellingGroupsActionCreators} from "../../../../actions/modellingGroupsActionCreators";

export interface ModellingGroupMembersAddProps {
    members: string[];
    users: User[];
    groupId: string;
    addUserToGroup: (groupId: string, username: string) => void;
}

export interface ModellingGroupMembersAddState {
    options: User[];
    selectedUser: string;
}

export class ModellingGroupMembersAddComponent extends React.Component<ModellingGroupMembersAddProps, ModellingGroupMembersAddState> {

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: ModellingGroupMembersAddProps) {
        const options = props.users
            .filter(x => props.members.indexOf(x.username) == -1)
            .sort((a, b) => a.username.localeCompare(b.username));
        const firstUser = options.length > 0 ? options[0].username : "";

        this.setState({
            selectedUser: firstUser,
            options: options
        })
    }

    handleChange(e: React.ChangeEvent<HTMLSelectElement>) {

        this.setState({
            selectedUser: e.target.value
        });
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.props.addUserToGroup(this.props.groupId, this.state.selectedUser);
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

export const mapStateToProps = (state: AdminAppState, props: Partial<ModellingGroupMembersAddProps>) :Partial<ModellingGroupMembersAddProps> => {
    return {
        members: props.members,
        users: state.users.users,
        groupId: props.groupId
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ModellingGroupMembersAddProps> => {
    return {
        addUserToGroup: (groupId: string, username: string) => dispatch(modellingGroupsActionCreators.addUserToGroup(groupId, username))
    }
};

export const ModellingGroupMembersAdd = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModellingGroupMembersAddComponent) as React.ComponentClass<Partial<ModellingGroupMembersAddProps>>;


