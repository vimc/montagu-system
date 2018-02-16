import {AuthState, initialAuthState} from "../../main/shared/reducers/authReducer";
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import { reducer as formReducer } from "redux-form";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {ModellingGroupsState, initialState as ModellingGroupsInitialState} from "../../main/contrib/reducers/modellingGroupsReducer";

export const mockAuthStateObject: AuthState = {
    loggedIn: true,
    username: 'test.user',
    bearerToken: 'TEST-TOKEN',
    permissions: [],
    modellingGroups: [],
    isAccountActive: true,
    isModeller: false
}

export const mockAuthState = (props?: Partial<AuthState>) => {
    return Object.assign({}, mockAuthStateObject, props);
}

export const mockGlobalState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    return {
        auth: authMock,
        form: formReducer
    };
}

export const mockAdminState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    return {
        auth: authMock,
        form: formReducer
    };
}

export const mockContribState = (props?: any) => {
    const authMock: AuthState = props && props.auth ? mockAuthState(props.auth) : mockAuthState();
    const groupsMock: ModellingGroupsState = props && props.groups ? props.groups : ModellingGroupsInitialState;
    return {
        auth: authMock,
        form: formReducer,
        groups: groupsMock
    };
}