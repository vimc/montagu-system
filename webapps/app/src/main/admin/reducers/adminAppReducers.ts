import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {modellingGroupsReducer, ModellingGroupsState} from "./modellingGroupsReducer";
import {UsersState, usersReducer} from "./usersReducer";
import {adminTouchstoneReducer, AdminTouchstoneState} from "./adminTouchstoneReducer";

export interface AdminAppState {
    auth: AuthState;
    form: FormReducer;
    groups: ModellingGroupsState
    breadcrumbs: BreadcrumbsState;
    users: UsersState;
    touchstones: AdminTouchstoneState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    users: usersReducer,
    touchstones: adminTouchstoneReducer
});

export default reducers;

