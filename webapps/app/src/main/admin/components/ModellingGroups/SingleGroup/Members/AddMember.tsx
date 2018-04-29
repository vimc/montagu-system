import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { AssociateUser, User } from "../../../../../shared/models/Generated";
import { modellingGroupActions } from "../../../../../shared/actions/ModellingGroupActions";
import fetcher from "../../../../../shared/sources/Fetcher";
import { processResponseAndNotifyOnErrors } from "../../../../../shared/sources/Source";
import { notificationActions, NotificationException } from "../../../../../shared/actions/NotificationActions";
import {GroupMembersContentComponent, GroupMembersContentProps} from "./GroupMembersContent";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../../shared/partials/LoadingElement/LoadingElement";
import {GroupMembersPageProps} from "./GroupMembersPage";
import {modellingGroupDetailsPageActionCreators} from "../../../../actions/pages/modellingGroupDetailsPageActionCreators";
import {modellingGroupsActionCreators} from "../../../../actions/modellingGroupsActionCreators";

export interface AddMemberProps {
    members: string[];
    users: User[];
    groupId: string;
    addUserToGroup: (groupId: string, username: string) => void;
}

export interface AddMemberState {
    options: User[];
    selectedUser: string;
}


export class AddMemberComponent extends React.Component<AddMemberProps, AddMemberState> {

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props: AddMemberProps) {
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

        // const href = `/modelling-groups/${this.props.groupId}/actions/associate-member/`;
        // const associateUser: AssociateUser = {
        //     username: this.state.selectedUser,
        //     action: "add"
        // };
        //
        // fetcher.fetcher.fetch(href, {
        //     method: "post",
        //     body: JSON.stringify(associateUser)
        // }).then((response: Response) => {
        //     return processResponseAndNotifyOnErrors(response)
        //         .then(() => {
        //             modellingGroupActions.addMember(this.state.selectedUser)
        //         })
        //         .catch((e: NotificationException) => notificationActions.notify(e))
        // });
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

export const mapStateToProps = (state: AdminAppState, props: Partial<AddMemberProps>) :Partial<AddMemberProps> => {
    return {
        members: props.members,
        users: props.users,
        groupId: props.groupId
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<AddMemberProps> => {
    return {
        addUserToGroup: (groupId: string, username: string) => dispatch(modellingGroupsActionCreators.addUserToGroup(groupId, username))
    }
};

export const AddMember = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(AddMemberComponent) as React.ComponentClass<Partial<AddMemberProps>>;


