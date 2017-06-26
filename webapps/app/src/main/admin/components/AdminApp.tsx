import * as React from "react";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { AdminRouter } from "./AdminRouter";
import { adminAuthStore } from "../stores/AdminAuthStore";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

export interface AdminAppProps {
    errors: string[];
    notifications: string[];
    loggedIn: boolean;
}

export class AdminAppComponent extends React.Component<AdminAppProps, undefined> {
    static getStores() {
        return [ notificationStore, adminAuthStore ];
    }
    static getPropsFromStores(): AdminAppProps {
        return {
            errors: notificationStore.getState().errors,
            notifications: notificationStore.getState().infos,
            loggedIn: adminAuthStore.getState().loggedIn
        }
    }

    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } />
            <NotificationArea notifications={ this.props.notifications } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const AdminApp = connectToStores(AdminAppComponent);