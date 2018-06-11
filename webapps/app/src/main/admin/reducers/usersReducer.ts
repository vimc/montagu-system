import {UsersAction, UsersTypes} from "../actionTypes/UsersTypes";
import {ErrorInfo, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/Helpers";

export interface UsersState {
    users: User[],
    allUserRoles: string[],
    showCreateUser: boolean,
    createUserErrors: ErrorInfo[],
    currentUser: User
}

export const usersInitialState: UsersState = {
    users: [],
    showCreateUser: false,
    createUserErrors: [],
    allUserRoles: [],
    currentUser: null
};

export const usersReducer = (state = usersInitialState, action: UsersAction): UsersState => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : usersInitialState.users};
        case UsersTypes.ALL_USER_ROLES_FETCHED:
            return {...state, allUserRoles: isNonEmptyArray(action.data) ? action.data : usersInitialState.allUserRoles};
        case UsersTypes.SHOW_CREATE_USER:
            return {
                ...state,
                showCreateUser: typeof action.data == "boolean" ? action.data : usersInitialState.showCreateUser
            };
        case UsersTypes.SET_CREATE_USER_ERRORS:
            return {
                ...state, createUserErrors: action.errors
            };
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
