import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { authActions } from "../../../shared/actions/AuthActions";
import { Link } from "simple-react-router";
import { ContribAuthState, contribAuthStore } from "../../stores/ContribAuthStore";

const style = require("./Logout.css");

export class LogoutComponent extends React.Component<ContribAuthState, undefined> {
    static getStores() {
        return [ contribAuthStore ];
    }

    static getPropsFromStores() {
        return contribAuthStore.getState();
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