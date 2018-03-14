import {Dispatch} from "redux";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {ReportReaderRemoved, ReportReadersFetched, UserActionTypes} from "../actionTypes/UsersActionTypes";
import {UserService} from "../services/UserService";
import {User} from "../../shared/models/Generated";

export const userActionCreators = {

    getReportReaders(reportName: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const users: User[] = await (new UserService(dispatch, getState)).getReportReaders(reportName);
            dispatch({
                type: UserActionTypes.REPORT_READERS_FETCHED,
                data: users
            } as ReportReadersFetched);
        }
    },

    removeReportReader(reportName: string, username: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new UserService(dispatch, getState)).removeReportReader(reportName, username);

            if (result == "OK") {
                dispatch({
                    type: UserActionTypes.REPORT_READER_REMOVED,
                    data: username
                } as ReportReaderRemoved);
            }
        }
    },

    addReportReader(reportName: string, username: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result = await (new UserService(dispatch, getState)).addReportReader(reportName, username);

            if (result == "OK") {
                dispatch(this.getReportReaders(reportName));
            }
        }
    }
};