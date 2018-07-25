import {UsersAction, UsersTypes} from "../actionTypes/UsersTypes";
import {ErrorInfo, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/ArrayHelpers";

export interface UsersState {
    users: User[],
    globalRoles: string[],
    showCreateUser: boolean,
    createUserErrors: ErrorInfo[],
    setPasswordToken: string,
    setPasswordErrors: ErrorInfo[],
    currentUser: User
}

export const usersInitialState: UsersState = {
    users: [],
    showCreateUser: false,
    createUserErrors: [],
    setPasswordErrors: [],
    setPasswordToken: null,
    globalRoles: [],
    currentUser: null
};

export const usersReducer = (state = usersInitialState, action: UsersAction): UsersState => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : usersInitialState.users};
        case UsersTypes.ALL_GLOBAL_ROLES_FETCHED:
            return {...state, globalRoles: isNonEmptyArray(action.data) ? action.data : usersInitialState.globalRoles};
        case UsersTypes.SHOW_CREATE_USER:
            return {
                ...state,
                showCreateUser: typeof action.data == "boolean" ? action.data : usersInitialState.showCreateUser
            };
        case UsersTypes.SET_CREATE_USER_ERRORS:
            return {...state, createUserErrors: action.errors};
        case UsersTypes.CHANGE_SET_PASSWORD_ERRORS:
            return {...state, setPasswordErrors: action.errors};
        case UsersTypes.CHANGE_SET_PASSWORD_TOKEN:
            return {...state, setPasswordToken: action.token};
        case UsersTypes.SET_CURRENT_USER:
            const currentUser = state.users.find(u => u.username == action.data);
            return {
                ...state,
                currentUser: currentUser
            };
        default:
            return state;
    }
};
