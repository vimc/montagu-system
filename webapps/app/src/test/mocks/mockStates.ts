import {AuthState} from "../../main/shared/reducers/authReducer";
import {reducer as formReducer} from "redux-form";
import {
    modellingGroupInitialState as ModellingGroupsInitialState,
    ModellingGroupsState
} from "../../main/contrib/reducers/modellingGroupsReducer";
import {
    modellingGroupInitialState as AdminModellingGroupsInitialState,
} from "../../main/admin/reducers/modellingGroupsReducer";
import {reportsInitialState, ReportsState} from "../../main/report/reducers/reportsReducer";
import {ReportAppState} from "../../main/report/reducers/reportAppReducers";
import {usersInitialState, UsersState} from "../../main/report/reducers/userReducer";
import {usersInitialState as adminUsersInitialState} from "../../main/admin/reducers/usersReducer";
import {UsersState as AdminUsersState} from "../../main/admin/reducers/usersReducer";
import {BreadcrumbsState, initialBreadcrumbsState} from "../../main/shared/reducers/breadcrumbsReducer";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {touchstonesInitialState, TouchstonesState} from "../../main/contrib/reducers/touchstonesReducer";
import {responsibilitiesInitialState, ResponsibilitiesState} from "../../main/contrib/reducers/responsibilitiesReducer";
import {diseasesInitialState, DiseasesState} from "../../main/contrib/reducers/diseasesReducer";
import {demographicInitialState, DemographicState} from "../../main/contrib/reducers/demographicReducer";
import {coverageInitialState, CoverageState} from "../../main/contrib/reducers/coverageReducer";
import {estimatesInitialState, EstimatesState} from "../../main/contrib/reducers/estimatesReducer";
import {runParametersInitialState, RunParametersState} from "../../main/contrib/reducers/runParametersReducer";
import { initialState as UserInitialState, UserState} from "../../main/contrib/reducers/userReducer";
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import {ModellingGroupsState as AdminModellingGroupsState} from "../../main/admin/reducers/modellingGroupsReducer";

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
    isModeller: false,
    isReportReviewer: false
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

export const mockAdminUsersState = (props?: RecursivePartial<AdminUsersState>): AdminUsersState => {
    return Object.assign({}, adminUsersInitialState, props);
};

export const mockAdminState = (props?: Partial<AdminAppState>): AdminAppState => {
    const authMock: AuthState = props && props.auth ? props.auth : mockAuthState();
    const groupsMock: AdminModellingGroupsState = props && props.groups ? props.groups : AdminModellingGroupsInitialState;
    const usersMock: AdminUsersState = props && props.users ? props.users : adminUsersInitialState;
    const breadcrumbsMock: BreadcrumbsState = props && props.breadcrumbs ? props && props.breadcrumbs : initialBreadcrumbsState;
    return {
        auth: authMock,
        form: formReducer,
        groups: groupsMock,
        breadcrumbs: breadcrumbsMock,
        users: usersMock
    };
};

export const mockContribState = (props?: any) :ContribAppState => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const groupsMock: ModellingGroupsState = props && props.groups ? props.groups : ModellingGroupsInitialState;
    const userMock: UserState = props && props.user ? props.user : UserInitialState;
    const touchstonesMock: TouchstonesState = props && props.touchstones ? props.touchstones : touchstonesInitialState;
    const responsibilitiesMock : ResponsibilitiesState = props && props.responsibilities ? props.responsibilities : responsibilitiesInitialState;
    const diseasesMock : DiseasesState = props && props.diseases ? props.diseases : diseasesInitialState;
    const demographicMock: DemographicState = props && props.demographic ? props.demographic : demographicInitialState;
    const coverageMock: CoverageState = props && props.coverage ? props.coverage : coverageInitialState;
    const estimatesMock: EstimatesState = props && props.estimates ? props.estimates : estimatesInitialState;
    const runParametersMock: RunParametersState = props && props.runParameters ? props.runParameters : runParametersInitialState;
    const breadcrumbsMock: BreadcrumbsState = props && props.breadcrumbs ? props && props.breadcrumbs : initialBreadcrumbsState;

    return {
        auth: authMock,
        form: formReducer,
        groups: groupsMock,
        breadcrumbs: breadcrumbsMock,
        user: userMock,
        touchstones: touchstonesMock,
        responsibilities: responsibilitiesMock,
        diseases: diseasesMock,
        demographic: demographicMock,
        coverage: coverageMock,
        estimates: estimatesMock,
        runParameters: runParametersMock
    };
};

export const mockReportAppState = (props?: any): ReportAppState => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const reportsMock: ReportsState = props && props.reports ? mockReportsState(props.reports) : mockReportsState();
    const usersMock: UsersState = props && props.users ? mockUsersState(props.users) : mockUsersState();
    const breadcrumbsMock: BreadcrumbsState = props && props.breadcrumbs ? props && props.breadcrumbs : initialBreadcrumbsState;
    return {
        auth: authMock,
        form: formReducer,
        reports: reportsMock,
        users: usersMock,
        breadcrumbs: breadcrumbsMock
    };
};