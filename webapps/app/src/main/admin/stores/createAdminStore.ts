import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/adminReducers';

export function createAdminStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


