import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { modellingGroupsReducer, ModellingGroupsState } from "./ModellingGroupsReducer";

export interface GlobalState {
    auth: AuthState;
    form: any;
    groups: ModellingGroupsState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
});

export default reducers;

