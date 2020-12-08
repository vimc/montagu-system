import * as React from "react";
import {connect} from 'react-redux';
import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {AdminRouter} from "./AdminRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {AppProps, mapStateToAppProps} from "../../shared/components/App";
import {AdminAppState} from "../reducers/adminAppReducers";

export class AdminAppComponent extends React.Component<AppProps, AdminAppState> {
    render() {
        return <div>
            <AdminRouter history={this.props.history} />
            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

export const AdminApp = connect(mapStateToAppProps)(AdminAppComponent);
