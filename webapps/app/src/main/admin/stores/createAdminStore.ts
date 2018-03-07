import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import {History} from "History";

import reducers from '../reducers/adminAppReducers';

export function createAdminStore(history: History) {
    return createStore(
        reducers,
        applyMiddleware(thunk, routerMiddleware(history)),
    );
}


