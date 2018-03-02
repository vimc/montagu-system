import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";
import { routerReducer } from 'react-router-redux';

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { reportsReducer, ReportsState } from "./reportsReducer";

export interface ReportAppState {
    auth: AuthState;
    form: FormReducer;
    reports: ReportsState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    reports: reportsReducer,
    router: routerReducer,
});

export default reducers;

