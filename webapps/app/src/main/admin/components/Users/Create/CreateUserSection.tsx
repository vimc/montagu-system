import * as React from "react";
import {branch, compose, renderNothing} from "recompose";
import {connect} from 'react-redux';

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CreateUserForm} from "./CreateUserForm";
import {Dispatch} from "redux";
import {usersActionCreators} from "../../../actions/usersActionCreators";

interface CreateUserSectionProps {
    show: boolean;
    setShowCreateUser: () => void;
    canCreateUsers: boolean;
}

export class CreateUserSectionComponent extends React.Component<Partial<CreateUserSectionProps>, undefined> {

    render() {
        if (this.props.show) {
            return <div>
                <CreateUserForm/>
            </div>;
        } else {
            return <button onClick={() => this.props.setShowCreateUser()}>
                Add new user
            </button>;
        }
    }
}

export const mapStateToProps = (state: AdminAppState): Partial<CreateUserSectionProps> => {
    return {
        show: state.users.showCreateUser,
        canCreateUsers: state.auth.permissions.indexOf("*/users.create") > -1
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<CreateUserSectionProps> => {
    return {
        setShowCreateUser: () => dispatch(usersActionCreators.setShowCreateUser(true))
    }
};

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: CreateUserSectionProps) => !props.canCreateUsers, renderNothing)
);

export const CreateUserSection = enhance(CreateUserSectionComponent);