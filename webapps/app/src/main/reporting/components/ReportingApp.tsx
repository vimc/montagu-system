import * as React from "react";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { ReportingRouter } from "./ReportingRouter";
import { adminAuthStore } from "../stores/ReportingAuthStore";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

export interface ReportingAppProps {
    errors: string[];
    infos: string[];
    loggedIn: boolean;
}

export class ReportingAppComponent extends React.Component<ReportingAppProps, undefined> {
    static getStores() {
        return [ notificationStore, adminAuthStore ];
    }
    static getPropsFromStores(): ReportingAppProps {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
            loggedIn: adminAuthStore.getState().loggedIn
        }
    }

    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } />
            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const AdminApp = connectToStores(ReportingAppComponent);