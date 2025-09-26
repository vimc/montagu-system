import {createStore, applyMiddleware, Store} from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import {History} from "history";

import reducers, {ContribAppState} from './reducers/contribAppReducers';

export function createContribStore(history: History): Store<ContribAppState> {
    return createStore(
        reducers,
        applyMiddleware(thunk, routerMiddleware(history)),
    ) as Store<ContribAppState>;
}


