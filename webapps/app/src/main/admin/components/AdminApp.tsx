import * as React from "react";
import {connect} from 'react-redux';
import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {AdminRouter} from "./AdminRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {AppProps, mapStateToAppProps} from "../../shared/components/App";

export class AdminAppComponent extends React.Component<AppProps, undefined> {
    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } history={this.props.history} permissions={this.props.permissions} />
            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

export const AdminApp = connect(mapStateToAppProps)(AdminAppComponent);
