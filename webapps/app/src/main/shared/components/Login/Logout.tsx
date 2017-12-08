import * as React from "react";
import { authActions } from "../../../shared/actions/AuthActions";
import { AuthStateBase } from "../../stores/AuthStoreBase";
import { InternalLink } from "../InternalLink";

import * as style from "./Logout.scss";

export abstract class LogoutComponent extends React.Component<AuthStateBase, undefined> {
    logout(e: React.MouseEvent<HTMLAnchorElement>) {
        authActions.logOut();
    }

    render() {
        if (this.props.loggedIn) {
            return <div className={ style.logout }>
                <div>
                    Logged in as { this.props.username } |
                    <InternalLink href="/" onClick={ this.logout }>
                        Log out
                    </InternalLink>
                </div>
            </div>;
        } else {
            return null;
        }
    }
}