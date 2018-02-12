import * as React from "react";
import { Dispatch } from "redux";

import { authActions } from "../../actions/authActions";
import { InternalLink } from "../InternalLink";
import { connect } from "react-redux";
import { GlobalState } from "../../reducers/GlobalState";

import "./Logout.scss";

interface LoggedInUserBoxProps {
    loggedIn: boolean;
    username: string;
    logOut: Dispatch<any>;
}

export class LoggedInUserBoxComponent extends React.Component<LoggedInUserBoxProps, undefined> {
    render() :JSX.Element {
        if (this.props.loggedIn) {
            return <div className="logout">
                <div>
                    Logged in as { this.props.username } |&nbsp;
                    <InternalLink href="/" onClick={ this.props.logOut }>
                        Log out
                    </InternalLink>
                </div>
            </div>;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state: GlobalState): Partial<LoggedInUserBoxProps> => ({
    loggedIn: state.auth.loggedIn,
    username: state.auth.username
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        logOut : (e: React.MouseEvent<HTMLAnchorElement>) => dispatch(authActions.logOut())
    }
};

export const LoggedInUserBox = connect(mapStateToProps, mapDispatchToProps)(LoggedInUserBoxComponent);