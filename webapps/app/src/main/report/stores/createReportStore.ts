import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/reportAppReducers';

export function createReportStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


