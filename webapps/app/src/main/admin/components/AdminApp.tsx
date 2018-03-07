import * as React from "react";
import { connect } from 'react-redux';
import {History} from "History";

import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { AdminRouter } from "./AdminRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";
import { AdminAppState } from "../reducers/adminAppReducers";

export interface AdminAppProps {
    errors: string[];
    infos: string[];
    loggedIn: boolean;
    history?: History;
}

export class AdminAppComponent extends React.Component<AdminAppProps, undefined> {
    static getStores() {
        return [ notificationStore ];
    }
    static getPropsFromStores(): Partial<AdminAppProps> {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
        }
    }

    render() {
        return <div>
            <AdminRouter loggedIn={ this.props.loggedIn } history={this.props.history} />
            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const AdminAppAltWrapped = connectToStores(AdminAppComponent);

const mapStateToProps = (state: AdminAppState, props: any): Partial<AdminAppProps> => {
    return {
        loggedIn: state.auth.loggedIn,
        history: props.history
    }
};

export const AdminApp = connect(mapStateToProps)(AdminAppAltWrapped);