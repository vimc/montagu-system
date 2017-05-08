import * as React from 'react'
import { connectToStores } from '../alt';

import * as MainStore from '../stores/MainStore';
import * as AuthStore from '../stores/AuthStore';
import { mainActions } from '../actions/MainActions';
import Router from './Router';

interface AppProps {
    auth: AuthStore.State,
    main: MainStore.State
}

export class ApplicationComponent extends React.Component<AppProps, undefined> {
    static getStores() {
        mainActions.fetch({});
        return [ MainStore.Store, AuthStore.Store ];
    }
    static getPropsFromStores(props: AppProps): AppProps {
        return {
            auth: AuthStore.Store.getState(),
            main: MainStore.Store.getState()
        };
    }

    render() {
        return <Router
            loggedIn={ this.props.auth.loggedIn }
            loaded={ this.props.main.ready } />;
    }
}

export const Application = connectToStores(ApplicationComponent);