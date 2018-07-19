import thunk from 'redux-thunk';
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {ReportAppState} from "../../main/report/reducers/reportAppReducers";
import {RecursivePartial} from "./mockStates";
import {MockStore} from "redux-mock-store";
const configureReduxMockStore  = require('redux-mock-store');

export function createMockAdminStore(initialState?: RecursivePartial<AdminAppState>) {
    return createMockStore(initialState);
}
export function createMockContribStore(initialState?: RecursivePartial<ContribAppState>) {
    return createMockStore(initialState);
}
export function createMockReportStore(initialState?: RecursivePartial<ReportAppState>): MockStore<ReportAppState> {
    return createMockStore(initialState);
}

/** This method is deprecated. Use the more specific versions above to get compile-time
 * errors
 */
export const createMockStore = (initialState: any = {}): MockStore<any> => {
    const middlewares: any = [thunk];
    const mockStore = configureReduxMockStore(middlewares);
    return mockStore(initialState);
};