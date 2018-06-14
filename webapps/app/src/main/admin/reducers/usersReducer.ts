import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {ErrorInfo, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/ArrayHelpers";

export interface UsersState {
    users: User[],
    showCreateUser: boolean,
    createUserErrors: ErrorInfo[],
    currentUser: User
}

export const usersInitialState: UsersState = {
    users: [],
    showCreateUser: false,
    createUserErrors: [],
    currentUser: null
};

export const usersReducer = (state = usersInitialState, action: UsersAction): UsersState => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : usersInitialState.users};
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
            const currentUser = state.users.find(u=>u.username == action.data);
            return {
                ...state,
                currentUser: currentUser
            };
        default:
            return state;
    }
};
