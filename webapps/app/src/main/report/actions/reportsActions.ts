import { Dispatch } from "redux";

import { ReportsService } from "../services/ReportsService";
import { ReportsFetched, ReportTypeKeys } from "../actionTypes/ReportsTypes";

export const reportsActions = {

    getReports() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            const reports: any = await (new ReportsService(dispatch, getState)).getAllReports();
            dispatch({
                type: ReportTypeKeys.REPORTS_FETCHED,
                data: reports
            } as ReportsFetched );
        }
    },




};
