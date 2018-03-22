import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";

export interface AdminAppState {
    auth: AuthState;
    form: FormReducer;
    breadcrumbs: BreadcrumbsState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    breadcrumbs: breadcrumbsReducer
});

export default reducers;

