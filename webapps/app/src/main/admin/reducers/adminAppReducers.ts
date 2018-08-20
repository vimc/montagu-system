import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";

import {authReducer} from "../../shared/reducers/authReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {modellingGroupsReducer, ModellingGroupsState} from "./modellingGroupsReducer";
import {usersReducer, UsersState} from "./usersReducer";
import {adminTouchstoneReducer, AdminTouchstoneState} from "./adminTouchstoneReducer";
import {CommonState} from "../../shared/reducers/CommonState";
import {notificationReducer} from "../../shared/reducers/notificationReducer";
import {demographicsReducer, DemographicsState} from "../../shared/reducers/demographicsReducer";
import {onetimeTokenReducer, OneTimeTokenState} from "../../shared/reducers/oneTimeTokenReducer";
import {scenarioReducer, ScenarioState} from "./scenarioReducer";

export interface AdminAppState extends CommonState {
    groups: ModellingGroupsState
    breadcrumbs: BreadcrumbsState;
    users: UsersState;
    touchstones: AdminTouchstoneState;
    scenario: ScenarioState;
    demographics: DemographicsState;
    onetimeTokens: OneTimeTokenState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    users: usersReducer,
    touchstones: adminTouchstoneReducer,
    scenario: scenarioReducer,
    notifications: notificationReducer,
    demographics: demographicsReducer,
    onetimeTokens: onetimeTokenReducer
});

export default reducers;

