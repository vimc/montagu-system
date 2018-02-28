import {User} from "../../shared/models/Generated";
import {UserActionTypes, UserTypeKeys} from "../actionTypes/UsersActionTypes";

export interface UsersState {
    reportReaders: User[];
}

export const usersInitialState: UsersState = {
    reportReaders: []
};

export const usersReducer = (state = usersInitialState, action: UserActionTypes): UsersState => {
    switch (action.type) {
        case UserTypeKeys.REPORT_READERS_FETCHED:
            return {... state, reportReaders: action.data};
        default:
            return state;
    }
};