import * as React from "react";
import { connect } from 'react-redux';

import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { mainStore } from "../stores/MainStore";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { ContribRouter } from "./ContribRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";

interface AppProps {
    loggedIn?: boolean,
    ready: boolean,
    errors: string[],
    infos: string[]
}

export class ContribAppComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ mainStore, notificationStore ];
    }

    static getPropsFromStores(): AppProps {
        return {
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

export const ContribAppAltWrapped = connectToStores(ContribAppComponent);

const mapStateToProps = (state: any) => {
    return {
        loggedIn: state.auth.loggedIn,
    }
};

export const ContribApp = connect(mapStateToProps)(ContribAppAltWrapped);