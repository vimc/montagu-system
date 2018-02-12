import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/contribReducers';

export function createContribStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


