import * as React from "react";
import { connectToStores } from "../../alt";
import { ErrorLog } from "./ErrorLog/ErrorLog";
import Router from "./Router";
import { AuthState, authStore } from "../stores/AuthStore";
import { MainState, mainStore } from "../stores/MainStore";

interface AppProps {
    auth: AuthState,
    main: MainState
}

export class ContributionAppComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ mainStore, authStore ];
    }

    static getPropsFromStores(props: AppProps): AppProps {
        return {
            auth: authStore.getState(),
            main: mainStore.getState()
        };
    }

    render() {
        return <div>
            <Router
                loggedIn={ this.props.auth.loggedIn }
                loaded={ this.props.main.ready } />
            <ErrorLog errors={ this.props.main.errors } />
        </div>;
    }
}

export const ContributionApp = connectToStores(ContributionAppComponent);