import * as React from "react";
import {connect} from 'react-redux';

import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {ReportingRouter} from "./ReportingRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {AppProps, mapStateToAppProps} from "../../shared/components/App";

export class ReportingAppComponent extends React.Component<AppProps, undefined> {
    render() :JSX.Element {
        return <div>
            <ReportingRouter loggedIn={ this.props.loggedIn } history={this.props.history} />
            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

export const ReportingApp = connect(mapStateToAppProps)(ReportingAppComponent);