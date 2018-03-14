import {User} from "../../shared/models/Generated";
import {UserAction, UserActionKeys} from "../actionTypes/UsersActions";

export interface UsersState {
    reportReaders: User[];
}

export const usersInitialState: UsersState = {
    reportReaders: []
};

export const usersReducer = (state = usersInitialState, action: UserAction): UsersState => {
    switch (action.type) {
        case UserActionKeys.REPORT_READERS_FETCHED:
            return {...state, reportReaders: action.data};
        case UserActionKeys.REPORT_READER_REMOVED:
            return {...state, reportReaders: state.reportReaders.filter(u => u.username != action.data)};
        default:
            return state;
    }
};