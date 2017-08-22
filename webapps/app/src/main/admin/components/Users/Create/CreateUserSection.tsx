import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { userStore } from "../../../stores/UserStore";
import { userActions } from "../../../actions/UserActions";
import { CreateUserForm } from "./CreateUserForm";

interface Props {
    show: boolean;
}

export class CreateUserSectionComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [userStore];
    }

    static getPropsFromStores(): Props {
        return {
            show: userStore.getState().showCreateUser
        }
    }

    renderForm() {
        if (this.props.show) {
            return <CreateUserForm/>;
        } else {
            return null;
        }
    }

    renderButton() {
        if (this.props.show) {
            return null;
        } else {
            return <button onClick={() => userActions.setShowCreateUser(true)}>
                Add new user
            </button>;
        }
    }

    render() {
        return <div>
            {this.renderButton()}
            {this.renderForm()}
        </div>;
    }
}

export const CreateUserSection = connectToStores(CreateUserSectionComponent);