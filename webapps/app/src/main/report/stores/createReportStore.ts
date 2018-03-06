import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import {History} from "History";

import reducers from '../reducers/reportAppReducers';

export function createReportStore(history: History) {
    return createStore(
        reducers,
        applyMiddleware(thunk, routerMiddleware(history)),
    );
}


