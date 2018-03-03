import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import reducers from '../reducers/reportAppReducers';

export function createReportStore(history: any) {
    return createStore(
        reducers,
        applyMiddleware(thunk, routerMiddleware(history)),
    );
}


