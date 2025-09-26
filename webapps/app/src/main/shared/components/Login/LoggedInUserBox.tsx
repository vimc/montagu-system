import * as React from "react";
import { Dispatch } from "redux";

import { authActionCreators } from "../../actions/authActionCreators";
import { InternalLink } from "../InternalLink";
import { connect } from "react-redux";
import { GlobalState } from "../../reducers/GlobalState";

interface LoggedInUserBoxProps {
    loggedIn: boolean;
    username: string;
    logOut: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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

export const mapStateToProps = (state: GlobalState): Partial<LoggedInUserBoxProps> => ({
    loggedIn: state.auth.loggedIn,
    username: state.auth.username
});

export const mapDispatchToProps = (dispatch: Dispatch<GlobalState>): Partial<LoggedInUserBoxProps> => {
    return {
        logOut : () => dispatch(authActionCreators.logOut())
    }
};

export const LoggedInUserBox = connect(mapStateToProps, mapDispatchToProps)(LoggedInUserBoxComponent);