import {UsersTypes, UsersAction} from "../actionTypes/UsersTypes";
import {User} from "../../shared/models/Generated";

export interface UsersState {
    users: User[]
}

export const usersInitialState: UsersState = {
    users: []
};

export const usersReducer = (state = usersInitialState, action: UsersAction) => {
    switch (action.type) {
        case UsersTypes.ALL_USERS_FETCHED:
            return {...state, users: action.data};
        default:
            return state;
    }
};

