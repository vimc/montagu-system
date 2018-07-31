import * as React from "react";
import {connect} from 'react-redux';
import {History} from "history";

import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {ReportingRouter} from "./ReportingRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {ReportAppState} from "../reducers/reportAppReducers";

export interface ReportingAppProps {
    loggedIn: boolean;
    history?: History;
}

export class ReportingAppComponent extends React.Component<ReportingAppProps, undefined> {
    render() :JSX.Element {
        return <div>
            <ReportingRouter loggedIn={ this.props.loggedIn } history={this.props.history} />
            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

const mapStateToProps = (state: ReportAppState, props: Partial<ReportingAppProps>) :Partial<ReportingAppProps> => {
  return {
      loggedIn: state.auth.loggedIn,
      history: props.history
  }
};

export const ReportingApp = connect(mapStateToProps)(ReportingAppComponent);