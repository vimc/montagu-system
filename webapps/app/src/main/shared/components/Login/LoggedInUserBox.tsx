import * as React from "react";
import { Dispatch } from "redux";

import { authActions } from "../../actions/authActions";
import { InternalLink } from "../InternalLink";
import { connect } from "react-redux";
import { AuthState } from "../../reducers/authReducer";

import "./Logout.scss";

interface LoggedInUserBoxProps {
    auth: AuthState;
    dispatch?: Dispatch<any>;
}

export class LoggedInUserBoxComponent extends React.Component<LoggedInUserBoxProps, undefined> {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
    }

    logout(e: React.MouseEvent<HTMLAnchorElement>) {
        this.props.dispatch(authActions.logOut());
    }

    render() :JSX.Element {
        if (this.props.auth.loggedIn) {
            return <div className="logout">
                <div>
                    Logged in as { this.props.auth.username } |&nbsp;
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

const mapStateToProps = (state: any) => ({
    auth: state.auth
});

export const LoggedInUserBox = connect(mapStateToProps)(LoggedInUserBoxComponent);