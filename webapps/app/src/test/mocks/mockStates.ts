import {AuthState} from "../../main/shared/reducers/authReducer";
import {reducer as formReducer} from "redux-form";
import {modellingGroupInitialState as ModellingGroupsInitialState} from "../../main/contrib/reducers/modellingGroupsReducer";
import {modellingGroupInitialState as AdminModellingGroupsInitialState,} from "../../main/admin/reducers/modellingGroupsReducer";
import {reportsInitialState, ReportsState} from "../../main/report/reducers/reportsReducer";
import {ReportAppState} from "../../main/report/reducers/reportAppReducers";
import {usersInitialState, UsersState} from "../../main/report/reducers/userReducer";
import {
    usersInitialState as adminUsersInitialState,
    UsersState as AdminUsersState
} from "../../main/admin/reducers/usersReducer";
import {BreadcrumbsState, initialBreadcrumbsState} from "../../main/shared/reducers/breadcrumbsReducer";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {touchstonesInitialState} from "../../main/contrib/reducers/contribTouchstonesReducer";
import {responsibilitiesInitialState} from "../../main/contrib/reducers/responsibilitiesReducer";
import {diseasesInitialState} from "../../main/contrib/reducers/diseasesReducer";
import {demographicInitialState} from "../../main/contrib/reducers/demographicReducer";
import {coverageInitialState} from "../../main/contrib/reducers/coverageReducer";
import {estimatesInitialState} from "../../main/contrib/reducers/estimatesReducer";
import {runParametersInitialState} from "../../main/contrib/reducers/runParametersReducer";
import {initialState as UserInitialState} from "../../main/contrib/reducers/userReducer";
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import {adminTouchstonesInitialState} from "../../main/admin/reducers/adminTouchstoneReducer";
import {onetimeTokensInitialState, OneTimeTokenState} from "../../main/shared/reducers/oneTimeTokenReducer";
import {initialNotificationState} from "../../main/shared/reducers/notificationReducer";

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

export const mockOnetimeTokenState = (props?: RecursivePartial<OneTimeTokenState>): OneTimeTokenState => {
    return Object.assign({}, onetimeTokensInitialState, props);
};

export const mockAdminUsersState = (props?: RecursivePartial<AdminUsersState>): AdminUsersState => {
    return Object.assign({}, adminUsersInitialState, props);
};

export const mockAdminState = (props?: RecursivePartial<AdminAppState>): AdminAppState => {
    const template: AdminAppState = {
        auth: mockAuthState(),
        form: formReducer,
        groups: AdminModellingGroupsInitialState,
        breadcrumbs: initialBreadcrumbsState,
        users: adminUsersInitialState,
        touchstones: adminTouchstonesInitialState,
        notifications: initialNotificationState
    };
    return Object.assign(template, props);
};

export const mockContribState = (props?: RecursivePartial<ContribAppState>) :ContribAppState => {
    const template: ContribAppState = {
        auth: mockAuthState(),
        form: formReducer,
        groups: ModellingGroupsInitialState,
        breadcrumbs: initialBreadcrumbsState,
        user: UserInitialState,
        touchstones: touchstonesInitialState,
        responsibilities: responsibilitiesInitialState,
        diseases: diseasesInitialState,
        demographic: demographicInitialState,
        coverage: coverageInitialState,
        estimates: estimatesInitialState,
        runParameters: runParametersInitialState,
        onetimeTokens: onetimeTokensInitialState,
        notifications: initialNotificationState
    };
    return Object.assign(template, props);
};

export const mockReportAppState = (props?: any): ReportAppState => {
    const onetimeTokensMock: OneTimeTokenState = props && props.onetimeTokens
        ? mockOnetimeTokenState(props.onetimeTokens): mockOnetimeTokenState();
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const reportsMock: ReportsState = props && props.reports ? mockReportsState(props.reports) : mockReportsState();
    const usersMock: UsersState = props && props.users ? mockUsersState(props.users) : mockUsersState();
    const breadcrumbsMock: BreadcrumbsState = props && props.breadcrumbs ? props && props.breadcrumbs : initialBreadcrumbsState;
    return {
        auth: authMock,
        form: formReducer,
        reports: reportsMock,
        users: usersMock,
        breadcrumbs: breadcrumbsMock,
        onetimeTokens: onetimeTokensMock,
        notifications: initialNotificationState
    };
};