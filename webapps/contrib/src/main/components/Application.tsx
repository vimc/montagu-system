import * as React from "react";
import { connectToStores } from "../alt";

import * as MainStore from "../stores/MainStore";
import * as AuthStore from "../stores/AuthStore";
import { ErrorLog } from "./ErrorLog/ErrorLog";
import Router from "./Router";

interface AppProps {
    auth: AuthStore.State,
    main: MainStore.State
}

export class ApplicationComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        return [ MainStore.Store, AuthStore.Store ];
    }

    static getPropsFromStores(props: AppProps): AppProps {
        return {
            auth: AuthStore.Store.getState(),
            main: MainStore.Store.getState()
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

export const Application = connectToStores(ApplicationComponent);