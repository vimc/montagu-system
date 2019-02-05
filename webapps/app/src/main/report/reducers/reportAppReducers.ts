import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {routerReducer} from 'react-router-redux';

import {authReducer} from "../../shared/reducers/authReducer";
import {reportsReducer, ReportsState} from "./reportsReducer";
import {usersReducer, UsersState} from "./userReducer";
import {breadcrumbsReducer, BreadcrumbsState} from "../../shared/reducers/breadcrumbsReducer";
import {onetimeTokenReducer, OneTimeTokenState} from "../../shared/reducers/oneTimeTokenReducer";
import {CommonState} from "../../shared/reducers/CommonState";
import {notificationReducer} from "../../shared/reducers/notificationReducer";
import {diseasesReducer} from "../../shared/reducers/diseasesReducer";
import { reduxPollingNamespace, reduxPollingReducer } from 'redux-polling';

export interface ReportAppState extends CommonState {
    reports: ReportsState;
    users: UsersState;
    breadcrumbs: BreadcrumbsState;
    onetimeTokens: OneTimeTokenState
}

const reducers = combineReducers({
    auth: authReducer,
    form: formReducer,
    reports: reportsReducer,
    router: routerReducer,
    users: usersReducer,
    breadcrumbs: breadcrumbsReducer,
    onetimeTokens: onetimeTokenReducer,
    notifications: notificationReducer,
    diseases: diseasesReducer,
    [reduxPollingNamespace]: reduxPollingReducer,
});

export default reducers;

