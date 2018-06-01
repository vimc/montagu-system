import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {ErrorInfo, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/Helpers";

export interface UsersState {
    users: User[]
    createUserErrors: ErrorInfo[],
    showCreateUser: boolean,
}

export const usersInitialState: UsersState = {
    users: [],
    createUserErrors: [],
    showCreateUser: false,
};

export const usersReducer = (state = usersInitialState, action: UsersAction) => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : []};
        case UsersTypes.SHOW_CREATE_USER:
            return {...state, showCreateUser: typeof action.data == "boolean" ? action.data : usersInitialState.showCreateUser};
        case UsersTypes.SET_CREATE_USER_ERRORS:
            return {
                ...state, createUserError: action.errors.length > 0 ? action.errors :
                    usersInitialState.createUserErrors
            };
        default:
            return state;
    }
};

