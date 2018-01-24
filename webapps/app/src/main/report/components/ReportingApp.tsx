import * as React from "react";

import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { ReportingRouter } from "./ReportingRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

import { notificationStore } from "../../shared/stores/NotificationStore";
import { connectToStores } from "../../shared/alt";
// import { reportingAuthStore } from "../stores/ReportingAuthStore";

import { Provider } from 'react-redux';
import configureStore from '../Store';
const store = configureStore();

export interface ReportingAppProps {
    errors: string[];
    infos: string[];
    // loggedIn: boolean;
}

export class ReportingAppComponent extends React.Component<any, undefined> {
    static getStores() {
        return [ notificationStore/*, reportingAuthStore */ ];
    }
    static getPropsFromStores(): ReportingAppProps {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
            // loggedIn: reportingAuthStore.getState().loggedIn
        }
    }

    render() {
        return <Provider store={store}>
                <div>
                    <ReportingRouter loggedIn={ this.props.loggedIn } />
                    <NotificationArea notifications={ this.props.infos } />
                    <ErrorLog errors={ this.props.errors } />
                </div>
        </Provider>;
    }
}

export const ReportingApp = connectToStores(ReportingAppComponent);