import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { dispatchInReducerMiddleware } from "../../shared/modules/dispatchInReducerMiddleware";
import reducers from '../reducers/reducers';

export function createReportStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk, dispatchInReducerMiddleware),
    );
}


