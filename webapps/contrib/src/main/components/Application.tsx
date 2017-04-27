import * as React from 'react'
import { connectToStores } from '../alt';

import { State, Store } from '../stores/MainStore';
import { mainActions } from '../actions/MainActions';
import Router from './Router';
import { LoadingPage } from './LoadingPage';

export class ApplicationComponent extends React.Component<State, undefined> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    render() {
        if (this.props.ready) {
            return <Router />
        } else {
            return <LoadingPage />;
        }
    }
}

export const Application = connectToStores(ApplicationComponent);