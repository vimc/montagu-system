import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";

export interface ReportAppState {
    auth: AuthState;
    form: FormReducer;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
});

export default reducers;

