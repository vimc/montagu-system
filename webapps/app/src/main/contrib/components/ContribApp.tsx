import * as React from "react";
import { connectToStores } from "../../shared/alt";
import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { contribAuthStore } from "../stores/ContribAuthStore";
import { mainStore } from "../stores/MainStore";
import { errorStore } from "../../shared/stores/ErrorStore";
import { ContribRouter } from "./ContribRouter";

interface AppProps {
    loggedIn: boolean,
    ready: boolean,
    errors: string[]
}

export class ContribAppComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ errorStore, contribAuthStore ];
    }

    static getPropsFromStores(): AppProps {
        return {
            loggedIn: contribAuthStore.getState().loggedIn,
            ready: mainStore.getState().ready,
            errors: errorStore.getState().errors
        };
    }

    render() {
        return <div>
            <ContribRouter
                loggedIn={ this.props.loggedIn }
                loaded={ this.props.ready } />
            <ErrorLog errors={ this.props.errors } />
        </div>;
    }
}

export const ContribApp = connectToStores(ContribAppComponent);