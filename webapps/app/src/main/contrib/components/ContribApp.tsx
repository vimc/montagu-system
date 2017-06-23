import * as React from "react";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { contribAuthStore } from "../stores/ContribAuthStore";
import { mainStore } from "../stores/MainStore";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { ContribRouter } from "./ContribRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

interface AppProps {
    loggedIn: boolean,
    ready: boolean,
    errors: string[],
    infos: string[]
}

export class ContribAppComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ mainStore, notificationStore, contribAuthStore ];
    }

    static getPropsFromStores(): AppProps {
        return {
            loggedIn: contribAuthStore.getState().loggedIn,
            ready: mainStore.getState().ready,
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos
        };
    }

    render() {
        return <div>
            <ContribRouter
                loggedIn={ this.props.loggedIn }
                loaded={ this.props.ready } />

            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const ContribApp = connectToStores(ContribAppComponent);