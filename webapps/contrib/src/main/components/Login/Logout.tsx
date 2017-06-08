import * as React from "react";
import { connectToStores } from "../../alt";
import { authActions } from "../../actions/AuthActions";
import { Link } from "simple-react-router";
import { AuthState, authStore } from "../../stores/AuthStore";

const style = require("./Logout.css");

export class LogoutComponent extends React.Component<AuthState, undefined> {
    static getStores() {
        return [ authStore ];
    }

    static getPropsFromStores() {
        return authStore.getState();
    }

    logout(e: React.MouseEvent<HTMLButtonElement>) {
        authActions.logOut();
    }

    render() {
        if (this.props.loggedIn) {
            return <div className={ style.logout }>
                <div>Logged in as { this.props.username } | <Link href="/" onClick={ this.logout }>Log out</Link></div>
            </div>;
        } else {
            return null;
        }
    }
}

export const Logout = connectToStores(LogoutComponent);