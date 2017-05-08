import * as React from "react";
import * as AuthStore from "../../stores/AuthStore";
import {connectToStores} from "../../alt";
import {ButtonLink} from '../ButtonLink';
import {authActions} from "../../actions/AuthActions";

const style = require("./Logout.css");

export class LogoutComponent extends React.Component<AuthStore.State, undefined> {
    static getStores() {
        return [AuthStore.Store];
    }
    static getPropsFromStores() {
        return AuthStore.Store.getState();
    }

    logout(e: React.MouseEvent<HTMLButtonElement>) {
        authActions.logOut();
    }

    render() {
        if (this.props.loggedIn) {
            return <div className={ style.logout }>
                <ButtonLink href="/" onClick={ this.logout }>Log out</ButtonLink>
            </div>;
        } else {
            return null;
        }
    }
}

export const Logout = connectToStores(LogoutComponent);