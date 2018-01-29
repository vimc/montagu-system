import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/Reducers';
import { authService } from '../../shared/services/AuthService';

export function createReportStore() {
    return createStore(
        reducers,
        applyMiddleware(thunk, authService),
    );
}


