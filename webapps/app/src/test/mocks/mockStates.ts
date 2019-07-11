import {AuthState} from "../../main/shared/reducers/authReducer";
import {reducer as formReducer} from "redux-form";
import {modellingGroupInitialState as ModellingGroupsInitialState} from "../../main/contrib/reducers/modellingGroupsReducer";
import {modellingGroupInitialState as AdminModellingGroupsInitialState,} from "../../main/admin/reducers/modellingGroupsReducer";
import {
    usersInitialState as adminUsersInitialState,
    UsersState as AdminUsersState
} from "../../main/admin/reducers/usersReducer";
import {BreadcrumbsState, initialBreadcrumbsState} from "../../main/shared/reducers/breadcrumbsReducer";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {touchstonesInitialState} from "../../main/contrib/reducers/contribTouchstonesReducer";
import {responsibilitiesInitialState} from "../../main/contrib/reducers/responsibilitiesReducer";
import {coverageInitialState} from "../../main/contrib/reducers/coverageReducer";
import {runParametersInitialState} from "../../main/contrib/reducers/runParametersReducer";
import {initialState as UserInitialState} from "../../main/contrib/reducers/userReducer";
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import {adminTouchstonesInitialState} from "../../main/admin/reducers/adminTouchstoneReducer";
import {onetimeTokensInitialState, OneTimeTokenState} from "../../main/shared/reducers/oneTimeTokenReducer";
import {initialNotificationState} from "../../main/shared/reducers/notificationReducer";
import {demographicsInitialState} from "../../main/shared/reducers/demographicsReducer";
import {scenarioInitialState} from "../../main/admin/reducers/scenarioReducer";
import {diseasesInitialState} from "../../main/shared/reducers/diseasesReducer";
import {estimatesInitialState} from "../../main/contrib/reducers/estimatesReducer";

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

export const mockOnetimeTokenState = (props?: RecursivePartial<OneTimeTokenState>): OneTimeTokenState => {
    return Object.assign({}, onetimeTokensInitialState, props);
};

export const mockAdminUsersState = (props?: RecursivePartial<AdminUsersState>): AdminUsersState => {
    return Object.assign({}, adminUsersInitialState, props);
};

export const mockAdminState = (props?: RecursivePartial<AdminAppState>): AdminAppState => {
    const template: AdminAppState = {
        demographics: demographicsInitialState,
        auth: mockAuthState(),
        form: formReducer,
        groups: AdminModellingGroupsInitialState,
        breadcrumbs: initialBreadcrumbsState,
        users: adminUsersInitialState,
        scenario: scenarioInitialState,
        diseases: diseasesInitialState,
        touchstones: adminTouchstonesInitialState,
        notifications: initialNotificationState,
        onetimeTokens: onetimeTokensInitialState
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
        demographics: demographicsInitialState,
        coverage: coverageInitialState,
        runParameters: runParametersInitialState,
        onetimeTokens: onetimeTokensInitialState,
        notifications: initialNotificationState,
        estimates: estimatesInitialState
    };
    return Object.assign(template, props);
};
