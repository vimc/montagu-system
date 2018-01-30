import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/AuthReducer";

export interface GlobalState {
    auth: AuthState;
    form: any;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
});

export default reducers;

