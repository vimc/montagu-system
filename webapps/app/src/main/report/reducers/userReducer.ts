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
            return {...state, reportReaders: action.data};
        case UserTypeKeys.REPORT_READER_REMOVED:
            return {...state, reportReaders: state.reportReaders.filter(u => u.username != action.data)};
        default:
            return state;
    }
};