import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {routerReducer} from "react-router-redux";

import {authReducer} from "../../shared/reducers/authReducer";
import {modellingGroupsReducer, ModellingGroupsState} from "./modellingGroupsReducer";
import {contribTouchstonesReducer, TouchstonesState} from "./contribTouchstonesReducer";
import {diseasesReducer} from "../../shared/reducers/diseasesReducer";
import {responsibilitiesReducer, ResponsibilitiesState} from "./responsibilitiesReducer";
import {coverageReducer, CoverageState} from "./coverageReducer";
import {runParametersReducer, RunParametersState} from "./runParametersReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {userReducer, UserState} from "./userReducer";
import {onetimeTokenReducer, OneTimeTokenState} from "../../shared/reducers/oneTimeTokenReducer";
import {CommonState} from "../../shared/reducers/CommonState";
import {notificationReducer} from "../../shared/reducers/notificationReducer";
import {demographicsReducer, DemographicsState} from "../../shared/reducers/demographicsReducer";

export interface ContribAppState extends CommonState {
    groups: ModellingGroupsState;
    user: UserState;
    breadcrumbs: BreadcrumbsState;
    touchstones: TouchstonesState;
    responsibilities: ResponsibilitiesState;
    demographics: DemographicsState;
    coverage: CoverageState;
    runParameters: RunParametersState;
    onetimeTokens: OneTimeTokenState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    user: userReducer,
    breadcrumbs: breadcrumbsReducer,
    touchstones: contribTouchstonesReducer,
    responsibilities: responsibilitiesReducer,
    diseases: diseasesReducer,
    demographics: demographicsReducer,
    coverage: coverageReducer,
    runParameters: runParametersReducer,
    router: routerReducer,
    onetimeTokens: onetimeTokenReducer,
    notifications: notificationReducer
});

export default reducers;
