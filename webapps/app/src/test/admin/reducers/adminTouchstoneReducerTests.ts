import {expect} from "chai";
import {
    adminTouchstoneReducer,
    adminTouchstonesInitialState, AdminTouchstoneState
} from "../../../main/admin/reducers/adminTouchstoneReducer";
import {TouchstonesAction, TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {mockTouchstone} from "../../mocks/mockModels";

describe("adminTouchstoneReducer", () => {
    it("sets fetched touchstones", () => {
        const data = [mockTouchstone(), mockTouchstone()];
        const action: TouchstonesAction = {
            type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED,
            data: data
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            touchstones: data
        };
        expect(adminTouchstoneReducer(undefined, action)).to.eql(expected);
    });
});