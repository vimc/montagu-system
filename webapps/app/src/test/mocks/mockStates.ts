import {AuthState} from "../../main/shared/reducers/authReducer";
import {reducer as formReducer} from "redux-form";
import {
    modellingGroupInitialState as ModellingGroupsInitialState,
    ModellingGroupsState
} from "../../main/contrib/reducers/modellingGroupsReducer";
import {reportsInitialState, ReportsState} from "../../main/report/reducers/reportsReducer";
import {ReportAppState} from "../../main/report/reducers/reportAppReducers";
import {usersInitialState, UsersState} from "../../main/report/reducers/userReducer";
import {BreadcrumbsState, initialBreadcrumbsState} from "../../main/shared/reducers/breadcrumbsReducer";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {touchstonesInitialState, TouchstonesState} from "../../main/contrib/reducers/touchstonesReducer";
import {responsibilitiesInitialState, ResponsibilitiesState} from "../../main/contrib/reducers/responsibilitiesReducer";
import {diseasesInitialState, DiseasesState} from "../../main/contrib/reducers/diseasesReducer";
import {demographicInitialState, DemographicState} from "../../main/contrib/reducers/demographicReducer";
import {coverageInitialState, CoverageState} from "../../main/contrib/reducers/coverageReducer";
import {estimatesInitialState, EstimatesState} from "../../main/contrib/reducers/estimatesReducer";
import {runParametersInitialState, RunParametersState} from "../../main/contrib/reducers/runParametersReducer";

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
    };

export const mockAuthStateObject: AuthState = {
    loggedIn: true,
    username: 'test.user',
    bearerToken: 'TEST-TOKEN',
    permissions: [],
    modellingGroups: [],
    isAccountActive: true,
    isModeller: false
};


export const mockAuthState = (props?: RecursivePartial<AuthState>) => {
    return Object.assign({}, mockAuthStateObject, props);
};

export const mockReportsState = (props?: RecursivePartial<ReportsState>): ReportsState => {
    return Object.assign({}, reportsInitialState, props);
};

export const mockUsersState = (props?: RecursivePartial<UsersState>): UsersState => {
    return Object.assign({}, usersInitialState, props);
};

export const mockGlobalState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const breadcrumbs: BreadcrumbsState = props && props.breadcrumbs ? {breadcrumbs: props.breadcrumbs} : initialBreadcrumbsState;
    return {
        auth: authMock,
        form: formReducer,
        breadcrumbs
    };
};

export const mockAdminState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    return {
        auth: authMock,
        form: formReducer,
        breadcrumbs: initialBreadcrumbsState
    };
};

export const mockContribState = (props?: any) :ContribAppState => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const groupsMock: ModellingGroupsState = props && props.groups ? props.groups : ModellingGroupsInitialState;
    const touchstonesMock: TouchstonesState = props && props.touchstones ? props.touchstones : touchstonesInitialState;
    const responsibilitiesMock : ResponsibilitiesState = props && props.responsibilities ? props.responsibilities : responsibilitiesInitialState;
    const diseasesMock : DiseasesState = props && props.diseases ? props.diseases : diseasesInitialState;
    const demographicMock: DemographicState = props && props.demographic ? props.demographic : demographicInitialState;
    const coverageMock: CoverageState = props && props.coverage ? props.coverage : coverageInitialState;
    const estimatesMock: EstimatesState = props && props.estimates ? props.estimates : estimatesInitialState;
    const runParametersMock: RunParametersState = props && props.runParameters ? props.runParameters : runParametersInitialState;

    return {
        auth: authMock,
        form: formReducer,
        groups: groupsMock,
        breadcrumbs: initialBreadcrumbsState,
        touchstones: touchstonesMock,
        responsibilities: responsibilitiesMock,
        diseases: diseasesMock,
        demographic: demographicMock,
        coverage: coverageMock,
        estimates: estimatesMock,
        runParameters: runParametersMock
    };
};

export const mockReportAppState = (props?: RecursivePartial<ReportAppState>): ReportAppState => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const reportsMock: ReportsState = props && props.reports ? mockReportsState(props.reports) : mockReportsState();
    const usersMock: UsersState = props && props.users ? mockUsersState(props.users) : mockUsersState();
    return {
        auth: authMock,
        form: formReducer,
        reports: reportsMock,
        users: usersMock,
        breadcrumbs: initialBreadcrumbsState
    };
};