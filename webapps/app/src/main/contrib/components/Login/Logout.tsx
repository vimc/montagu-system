import * as React from "react";
import { connectToStores } from "../../../shared/alt";
import { authActions } from "../../../shared/actions/AuthActions";
import { ContribAuthState, contribAuthStore } from "../../stores/ContribAuthStore";
import { InternalLink } from "../../../shared/components/InternalLink";

const style = require("./Logout.css");

export class LogoutComponent extends React.Component<ContribAuthState, undefined> {
    static getStores() {
        return [ contribAuthStore ];
    }

    static getPropsFromStores() {
        return contribAuthStore.getState();
    }

    logout(e: React.MouseEvent<HTMLAnchorElement>) {
        authActions.logOut();
    }

    render() {
        if (this.props.loggedIn) {
            return <div className={ style.logout }>
                <div>Logged in as { this.props.username } | <InternalLink href="/" onClick={ this.logout }>Log out</InternalLink></div>
            </div>;
        } else {
            return null;
        }
    }
}

export const Logout = connectToStores(LogoutComponent);