import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {ErrorInfo, User} from "../../shared/models/Generated";
import {isNonEmptyArray} from "../../shared/Helpers";

export interface UsersState {
    users: User[]
    createUserErrors: ErrorInfo[],
}

export const usersInitialState: UsersState = {
    users: [],
    createUserErrors: [],
};

export const usersReducer = (state = usersInitialState, action: UsersAction) => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: isNonEmptyArray(action.data) ? action.data : []};
        case UsersTypes.SET_CREATE_USER_ERRORS:
            return {
                ...state, createUserError: action.errors.length > 0 ? action.errors :
                    usersInitialState.createUserErrors
            };
        default:
            return state;
    }
};

