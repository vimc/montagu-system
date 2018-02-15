import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

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
    reports: reportsReducer
});

export default reducers;

