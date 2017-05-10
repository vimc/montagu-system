import * as React from "react";
import * as AuthStore from "../../stores/AuthStore";
import {connectToStores} from "../../alt";
import {ButtonLink} from '../ButtonLink';
import {authActions} from "../../actions/AuthActions";
import {Link} from "simple-react-router";

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
            const groups = this.props.modellingGroups.join(", ");
            return <div className={ style.logout }>
                <div>Logged in as { this.props.username } | <Link href="/" onClick={ this.logout }>Log out</Link></div>
                <div>
                    Member of: { groups }
                </div>
            </div>;
        } else {
            return null;
        }
    }
}

export const Logout = connectToStores(LogoutComponent);