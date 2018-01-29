import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/Reducers';
import { authService } from '../../shared/services/AuthService';

const store = createStore(
    reducers,
    applyMiddleware(thunk, authService),
);

export default store;
