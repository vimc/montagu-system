import * as React from "react";
import { connect } from 'react-redux';

import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { ReportingRouter } from "./ReportingRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";

export interface ReportingAppProps {
    errors: string[];
    infos: string[];
    loggedIn?: boolean;
}

export class ReportingAppComponent extends React.Component<any, undefined> {
    static getStores() {
        return [ notificationStore ];
    }
    static getPropsFromStores(): ReportingAppProps {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
        }
    }

    render() :JSX.Element {
        return <div>
            <ReportingRouter loggedIn={ this.props.loggedIn } />
            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const ReportingAppAltWrapped = connectToStores(ReportingAppComponent);

const mapStateToProps = (state: any) => {
  return {
      loggedIn: state.auth.loggedIn,
  }
};

export const ReportingApp = connect(mapStateToProps)(ReportingAppAltWrapped);