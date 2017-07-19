import * as React from "react";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { ReportingRouter } from "./ReportingRouter";
import { reportingAuthStore } from "../stores/ReportingAuthStore";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

export interface ReportingAppProps {
    errors: string[];
    infos: string[];
    loggedIn: boolean;
}

export class ReportingAppComponent extends React.Component<ReportingAppProps, undefined> {
    static getStores() {
        return [ notificationStore, reportingAuthStore  ];
    }
    static getPropsFromStores(): ReportingAppProps {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
            loggedIn: reportingAuthStore.getState().loggedIn
        }
    }

    render() {
        return <div>
            <ReportingRouter loggedIn={ this.props.loggedIn } />
            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const ReportingApp = connectToStores(ReportingAppComponent);