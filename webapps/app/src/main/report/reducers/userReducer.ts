import {User} from "../../shared/models/Generated";
import {UserAction, UserActionTypes} from "../actionTypes/UsersActionTypes";

export interface UsersState {
    reportReaders: User[];
}

export const usersInitialState: UsersState = {
    reportReaders: []
};

export const usersReducer = (state = usersInitialState, action: UserAction): UsersState => {
    switch (action.type) {
        case UserActionTypes.REPORT_READERS_FETCHED:
            return {...state, reportReaders: action.data};
        case UserActionTypes.REPORT_READER_REMOVED:
            return {...state, reportReaders: state.reportReaders.filter(u => u.username != action.data)};
        default:
            return state;
    }
};