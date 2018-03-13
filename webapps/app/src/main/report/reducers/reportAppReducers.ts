import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";
import { routerReducer } from 'react-router-redux';

import {authReducer, AuthState} from "../../shared/reducers/authReducer";
import {reportsReducer, ReportsState} from "./reportsReducer";
import {usersReducer, UsersState} from "./userReducer";
import {breadcrumbsReducer} from "../../shared/reducers/breadcrumbsReducer";

export interface ReportAppState {
    auth: AuthState;
    form: FormReducer;
    reports: ReportsState;
    users: UsersState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    reports: reportsReducer,
    router: routerReducer,
    users: usersReducer,
    breadcrumbs: breadcrumbsReducer
});

export default reducers;

