import * as React from "react";
import { authActions } from "../../../shared/actions/AuthActions";
import { Link } from "simple-react-router";
import { AuthStateBase } from "../../stores/AuthStoreBase";

const style = require("./Logout.css");

export abstract class LogoutComponent extends React.Component<AuthStateBase, undefined> {
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