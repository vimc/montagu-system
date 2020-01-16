
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
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });

    it("sets current touchstone", () => {
        const data = mockTouchstone();
        const action: TouchstonesAction = {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            currentTouchstone: data
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });

    it("sets create touchstone errors", () => {
        const errors = [{code: "e", message: "error"}];
        const action: TouchstonesAction = {
            type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR,
            data: errors
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            createTouchstoneErrors: errors
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });

    it("adds new touchstone", () => {
        const touchstone = mockTouchstone();
        const action: TouchstonesAction = {
            type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED,
            data: touchstone
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            touchstones: [touchstone]
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });
});