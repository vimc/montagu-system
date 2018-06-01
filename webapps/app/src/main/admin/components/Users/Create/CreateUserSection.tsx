import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CreateUserForm} from "./CreateUserForm";
import {Dispatch} from "redux";
import {usersActionCreators} from "../../../actions/usersActionCreators";

interface CreateUserSectionProps {
    show: boolean;
    setShowCreateUser: () => void;
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
        show: state.users.showCreateUser
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<CreateUserSectionProps> => {
    return {
        setShowCreateUser: () => dispatch(usersActionCreators.setShowCreateUser(true))
    }
};

export const CreateUserSection = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(CreateUserSectionComponent) as React.ComponentClass<Partial<CreateUserSectionProps>>;