import {
    adminTouchstoneReducer,
    adminTouchstonesInitialState,
    AdminTouchstoneState
} from "../../../main/admin/reducers/adminTouchstoneReducer";
import {TouchstonesAction, TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {
    mockAnnotatedResponsibility,
    mockAnnotatedResponsibilitySet,
    mockResponsibilitySetWithExpectations,
    mockTouchstone
} from "../../mocks/mockModels";
import {ResponsibilitySetWithComments} from "../../../main/shared/models/APITypes";

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

    it("sets current responsibility", () => {
        const data = mockAnnotatedResponsibility()
        const action: TouchstonesAction = {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY,
            data
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            currentResponsibility: data
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });

    it("sets current responsibility set", () => {
        const data = mockAnnotatedResponsibilitySet();
        const action: TouchstonesAction = {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET,
            data
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            currentResponsibilitySet: data
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });

    it("sets annotated responsibility set", () => {
        const testResponsibilitySet = mockResponsibilitySetWithExpectations();
        const data: ResponsibilitySetWithComments[] = [{
            modelling_group_id: testResponsibilitySet.modelling_group_id,
            touchstone_version: testResponsibilitySet.touchstone_version,
            comment: null,
            responsibilities: testResponsibilitySet.responsibilities.map(r => ({
                scenario_id: r.scenario.id,
                comment: null,
                ...r
            }))
        }];
        const action: TouchstonesAction = {
            type: TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED,
            data
        };
        const expected: AdminTouchstoneState = {
            ...adminTouchstonesInitialState,
            currentResponsibilityComments: data
        };
        expect(adminTouchstoneReducer(undefined, action)).toEqual(expected);
    });
});