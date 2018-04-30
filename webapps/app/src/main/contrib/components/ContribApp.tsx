import * as React from "react";
import { connect } from 'react-redux';
import {History} from "history";

import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { notificationStore } from "../../shared/stores/NotificationStore";
import { ContribRouter } from "./ContribRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";
import {ContribAppState} from "../reducers/contribAppReducers";

interface AppProps {
    loggedIn: boolean,
    errors: string[],
    infos: string[],
    history?: History;
}

export class ContribAppComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ notificationStore ];
    }

    static getPropsFromStores(): Partial<AppProps> {
        return {
            errors: notificationStore.getState().errors,
            infos: notificationStore.getState().infos,
        };
    }

    render() {
        return <div>
            <ContribRouter
                history={this.props.history}
                loggedIn={ this.props.loggedIn }
            />

            <NotificationArea notifications={ this.props.infos } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const ContribAppAltWrapped = connectToStores(ContribAppComponent);

const mapStateToProps = (state: ContribAppState, props: Partial<AppProps>) : Partial<AppProps> => {
    return {
        loggedIn: state.auth.loggedIn,
        history: props.history
    }
};

export const ContribApp = connect(mapStateToProps)(ContribAppAltWrapped);