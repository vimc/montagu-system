import {combineReducers} from "redux";
import {FormReducer, reducer as formReducer} from "redux-form";

import {authReducer, AuthState} from "../../shared/reducers/authReducer";
import {reportsReducer, ReportsState} from "./reportsReducer";
import {usersReducer, UsersState} from "./userReducer";

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
    users: usersReducer
});

export default reducers;

