import {reportsReducer} from "../../../main/report/reducers/reportsReducer";
import {mockReportsState} from "../../mocks/mockStates";
import {mockReport, mockVersion} from "../../mocks/mockModels";
import {ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {expect} from "chai";

describe('Reports reducer tests', () => {

    // TODO for now this should pass through state unchanged bc publish button is not connected
    it('should pass through state unchanged when report published', () => {

        const originalState = mockReportsState({
            reports: [mockReport({name: "r1"})],
            versionDetails: mockVersion({name: "r1", id: "v1"})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_PUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState).to.deep.eq(originalState);
    });

    // TODO for now this should pass through state unchanged bc publish button is not connected
    it('should pass through state unchanged when report unpublished', () => {

        const originalState = mockReportsState({
            reports: [mockReport({name: "r1"})],
            versionDetails: mockVersion({name: "r1", id: "v1"})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_UNPUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState).to.deep.eq(originalState);
    });

});