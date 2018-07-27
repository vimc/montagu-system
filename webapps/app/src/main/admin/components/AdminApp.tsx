import * as React from "react";
import {connect} from 'react-redux';
import {History} from "history";
import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {AdminRouter} from "./AdminRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {AdminAppState} from "../reducers/adminAppReducers";

export interface AdminAppProps {
    loggedIn: boolean;
    history?: History;
}

export class AdminAppComponent extends React.Component<AdminAppProps, undefined> {
    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } history={this.props.history} />
            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

const mapStateToProps = (state: AdminAppState, props: Partial<AdminAppProps>): Partial<AdminAppProps> => {
    return {
        loggedIn: state.auth.loggedIn,
        history: props.history
    }
};

export const AdminApp = connect(mapStateToProps)(AdminAppComponent);