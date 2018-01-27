import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/Reducers';

export interface AuthState {
    loggedIn: boolean;
    username: string;
    bearerToken: string;
    permissions: string[];
    modellingGroups?: any;
}

const store = createStore(
    reducers,
    applyMiddleware(thunk),
);

export default store;
