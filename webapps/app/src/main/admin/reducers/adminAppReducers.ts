import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {modellingGroupsReducer, ModellingGroupsState} from "./modellingGroupsReducer";
import {UsersState, usersReducer} from "./usersReducer";

export interface AdminAppState {
    auth: AuthState;
    form: FormReducer;
    groups: ModellingGroupsState
    breadcrumbs: BreadcrumbsState;
    users: UsersState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    users: usersReducer
});

export default reducers;

