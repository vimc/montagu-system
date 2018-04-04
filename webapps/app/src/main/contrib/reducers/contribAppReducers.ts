import { combineReducers } from "redux";
import { reducer as formReducer, FormReducer } from "redux-form";

import { authReducer, AuthState } from "../../shared/reducers/authReducer";
import { modellingGroupsReducer, ModellingGroupsState } from "./modellingGroupsReducer";
import { touchstonesReducer, TouchstonesState } from "./touchstonesReducer";
import { diseasesReducer, DiseasesState } from "./diseasesReducer";
import { responsibilitiesReducer, ResponsibilitiesState } from "./responsibilitiesReducer";
import { demographicReducer, DemographicState } from "./demographicReducer";
import { runParametersReducer, RunParametersState } from "./runParametersReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";

export interface ContribAppState {
    auth: AuthState;
    form: FormReducer;
    groups: ModellingGroupsState;
    breadcrumbs: BreadcrumbsState;
    touchstones: TouchstonesState;
    responsibilities: ResponsibilitiesState;
    diseases: DiseasesState;
    demographic: DemographicState;
    runParameters: RunParametersState;
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    groups: modellingGroupsReducer,
    breadcrumbs: breadcrumbsReducer,
    touchstones: touchstonesReducer,
    responsibilities: responsibilitiesReducer,
    diseases: diseasesReducer,
    demographic: demographicReducer,
    runParameters: runParametersReducer
});

export default reducers;
