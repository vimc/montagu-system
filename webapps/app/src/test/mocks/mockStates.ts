import {AuthState} from "../../main/shared/reducers/authReducer";
import {reducer as formReducer} from "redux-form";
import {
    initialState as ModellingGroupsInitialState,
    ModellingGroupsState
} from "../../main/contrib/reducers/modellingGroupsReducer";
import {reportsInitialState, ReportsState} from "../../main/report/reducers/reportsReducer";
import {ReportAppState} from "../../main/report/reducers/reportAppReducers";
import {usersInitialState, UsersState} from "../../main/report/reducers/userReducer";

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
    return {
        auth: authMock,
        form: formReducer
    };
};

export const mockAdminState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    return {
        auth: authMock,
        form: formReducer
    };
};

export const mockContribState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const groupsMock: ModellingGroupsState = props && props.groups ? props.groups : ModellingGroupsInitialState;
    return {
        auth: authMock,
        form: formReducer,
        groups: groupsMock
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
        users: usersMock
    };
};