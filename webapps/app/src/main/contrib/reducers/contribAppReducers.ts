import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { modellingGroupsReducer, ModellingGroupsState } from "./modellingGroupsReducer";
import { touchstonesReducer, TouchstonesState } from "./touchstonesReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";

export interface ContribAppState {
    auth: AuthState;
    form: FormReducer;
    groups: ModellingGroupsState;
    breadcrumbs: BreadcrumbsState;
    touchstones: TouchstonesState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    touchstones: touchstonesReducer
});

export default reducers;
