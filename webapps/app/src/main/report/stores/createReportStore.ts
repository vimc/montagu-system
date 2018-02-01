import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/Reducers';

export function createReportStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


