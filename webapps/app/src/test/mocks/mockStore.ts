import thunk from 'redux-thunk';
import {AdminAppState} from "../../main/admin/reducers/adminAppReducers";
import {ContribAppState} from "../../main/contrib/reducers/contribAppReducers";
import {mockAdminState, mockContribState, RecursivePartial} from "./mockStates";
import {MockStore} from "redux-mock-store";
import {GlobalState} from "../../main/shared/reducers/GlobalState";
const configureReduxMockStore  = require('redux-mock-store');

export function createMockAdminStore(initialState?: RecursivePartial<AdminAppState>) {
    return createMockStore(mockAdminState(initialState));
}
export function createMockContribStore(initialState?: RecursivePartial<ContribAppState>) {
    return createMockStore(mockContribState(initialState));
}

/** This method is deprecated. Use the more specific versions above to get compile-time
 * errors
 */
export const createMockStore = (initialState: any = {}): MockStore<any> => {
    const middlewares: any = [thunk];
    const mockStore = configureReduxMockStore(middlewares);
    return mockStore(initialState);
};