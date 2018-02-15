import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { repo, AuthState } from "./reportsReducer";

export interface ReportAppState {
    auth: AuthState;
    form: FormReducer;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    reports
});

export default reducers;

