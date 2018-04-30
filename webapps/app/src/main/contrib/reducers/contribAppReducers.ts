import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";
import {routerReducer} from "react-router-redux";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { modellingGroupsReducer, ModellingGroupsState } from "./modellingGroupsReducer";
import { touchstonesReducer, TouchstonesState } from "./touchstonesReducer";
import { diseasesReducer, DiseasesState } from "./diseasesReducer";
import { responsibilitiesReducer, ResponsibilitiesState } from "./responsibilitiesReducer";
import { demographicReducer, DemographicState } from "./demographicReducer";
import { coverageReducer, CoverageState } from "./coverageReducer";
import { runParametersReducer, RunParametersState } from "./runParametersReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {estimatesReducer, EstimatesState} from "./estimatesReducer";
import {UserState, userReducer} from "./userReducer";


export interface ContribAppState {
    auth: AuthState;
    form: FormReducer;
    groups: ModellingGroupsState;
    user: UserState;
    breadcrumbs: BreadcrumbsState;
    touchstones: TouchstonesState;
    responsibilities: ResponsibilitiesState;
    diseases: DiseasesState;
    demographic: DemographicState;
    coverage: CoverageState;
    estimates: EstimatesState;
    runParameters: RunParametersState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    user: userReducer,
    breadcrumbs: breadcrumbsReducer,
    touchstones: touchstonesReducer,
    responsibilities: responsibilitiesReducer,
    diseases: diseasesReducer,
    demographic: demographicReducer,
    coverage: coverageReducer,
    estimates: estimatesReducer,
    runParameters: runParametersReducer,
    router: routerReducer
});

export default reducers;
