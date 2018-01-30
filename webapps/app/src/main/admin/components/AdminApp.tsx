import * as React from "react";
import { connect } from 'react-redux';

import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { AdminRouter } from "./AdminRouter";
// import { adminAuthStore } from "../stores/AdminAuthStore";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";
// import {ReportingAppAltWrapped} from "../../report/components/ReportingApp";

export interface AdminAppProps {
    errors: string[];
    infos: string[];
    loggedIn?: boolean;
}

export class AdminAppComponent extends React.Component<AdminAppProps, undefined> {
    static getStores() {
        return [ notificationStore ];
    }
    static getPropsFromStores(): AdminAppProps {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
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

export const AdminAppAltWrapped = connectToStores(AdminAppComponent);

const mapStateToProps = (state: any) => {
    return {
        loggedIn: state.auth.loggedIn,
    }
};

export const AdminApp = connect(mapStateToProps)(AdminAppAltWrapped);