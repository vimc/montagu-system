import {Dispatch} from "redux";

import {ReportsService} from "../services/ReportsService";
import {
    ReportPublished, ReportsActionsTypes, ReportsFetched, ReportTypeKeys,
    ReportUnpublished
} from "../actionTypes/ReportsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {Report} from "../../shared/models/Generated";

export const reportsActions = {

    getReports() {
        return async (dispatch: Dispatch<ReportsActionsTypes>, getState: () => GlobalState) => {
            const reports: Report[] = await (new ReportsService(dispatch, getState)).getAllReports();
            dispatch({
                type: ReportTypeKeys.REPORTS_FETCHED,
                data: reports
            } as ReportsFetched);
        }
    },

    publishReport(name: string, version: string) {
        //TODO
    },

    unPublishReport(name: string, version: string) {
        //TODO
    }
};
