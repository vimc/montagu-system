import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/adminAppReducers';

export function createAdminStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk),
    );
}


