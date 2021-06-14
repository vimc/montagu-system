import {adminTouchstoneActionCreators} from "../../../main/admin/actions/adminTouchstoneActionCreators";
import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {
    verifyActionThatCallsService,
    verifyActionThatCallsServiceAndReturnsResult
} from "../../ActionCreatorTestHelpers";
import {touchstonesActionCreators} from "../../../main/shared/actions/touchstoneActionCreators";
import {mockResponsibilitySetWithExpectations, mockTouchstone} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import DoneCallback = jest.DoneCallback;


describe("Admin touchstone action tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets all touchstones", (done: DoneCallback) => {
        verifyActionThatCallsServiceAndReturnsResult(done, {
            mockServices: () => sandbox.stubService(TouchstonesService.prototype, "getAllTouchstones"),
            callActionCreator: () => adminTouchstoneActionCreators.getAllTouchstones(),
            expectTheseActionTypes: [TouchstoneTypes.ALL_TOUCHSTONES_FETCHED]
        })
    });

    it("gets responsibilities for touchstone version", (done: DoneCallback) => {
        verifyActionThatCallsServiceAndReturnsResult(done, {
            mockServices: () => sandbox.stubService(TouchstonesService.prototype, "getResponsibilitiesForTouchstoneVersion"),
            callActionCreator: () => adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion("t1"),
            expectTheseActionTypes: [TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED]
        })
    });

    it("creates a new touchstone", (done: DoneCallback) => {

        const touchstone = mockTouchstone({id: "tId"});
        verifyActionThatCallsService(done, {
            store: createMockAdminStore({touchstones: {touchstones: []}}),
            mockServices: () => {
            }, // right now this isn't wired up to a service
            callActionCreator: () => adminTouchstoneActionCreators.createTouchstone(touchstone),
            expectTheseActions: [{type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED, data: {...touchstone, versions: []}}]
        })
    });

    it("returns error if duplicate touchstone id is added",
        (done: DoneCallback) => {

            const touchstone = mockTouchstone({id: "tId"});
            const store = createMockAdminStore({touchstones: {touchstones: [touchstone]}});

            store.dispatch(adminTouchstoneActionCreators.createTouchstone(touchstone));

            setTimeout(() => {
                const actions = store.getActions();
                expect(actions).toEqual([{
                    type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR,
                    data: [{
                        code: "error",
                        message: "Touchstone with id tId already exists. Please choose a unique id."
                    }]
                }]);
                done();
            });
        }
    );

    it("sets current touchstone if exists", async () => {
        const touchstone = mockTouchstone({id: "tId"});
        const options = [touchstone, mockTouchstone()];
        expect(touchstonesActionCreators.setCurrentTouchstone("tId", options)).toEqual({
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: touchstone
        });
    });

    it("setCurrentTouchstone throws exception if touchstone does not exist",
        async () => {
            const options = [mockTouchstone(), mockTouchstone()];
            expect(() => touchstonesActionCreators.setCurrentTouchstone("tId", options)).toThrow();
        }
    );

    it("set currents responsibility", () => {
        const responsibilitySet = mockResponsibilitySetWithExpectations();
        const responsibility = {
            ...responsibilitySet.responsibilities[0],
            modellingGroup: responsibilitySet.modelling_group_id
        };
        expect(adminTouchstoneActionCreators.setCurrentTouchstoneResponsibility(responsibility)).toEqual({
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY,
            data: responsibility
        });
    });

    it("gets annotated responsibilities for touchstone version", (done: DoneCallback) => {
        verifyActionThatCallsServiceAndReturnsResult(done, {
            mockServices: () => sandbox.stubService(TouchstonesService.prototype, "getResponsibilityCommentsForTouchstoneVersion"),
            callActionCreator: () => adminTouchstoneActionCreators.getResponsibilityCommentsForTouchstoneVersion("t1"),
            expectTheseActionTypes: [TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED]
        })
    });

    it("annotates a responsibility", (done: DoneCallback) => {
        const clearCacheStub = sandbox.setStubReduxAction(TouchstonesService.prototype, "clearCacheForTouchstoneResponsibilityComments");
        verifyActionThatCallsService(done, {
            mockServices: () => {
                sandbox.stubService(TouchstonesService.prototype, "addResponsibilityComment");
                sandbox.stubService(TouchstonesService.prototype, "getResponsibilityCommentsForTouchstoneVersion");
            },
            callActionCreator: () => adminTouchstoneActionCreators.addResponsibilityComment("t1", "m1", "s1", "c"),
            expectTheseActions: [
                {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_RESPONSIBILITY, data: null},
                {type: TouchstoneTypes.RESPONSIBILITY_COMMENTS_FOR_TOUCHSTONE_VERSION_FETCHED, data: "default_result"}
            ]
        });
        setTimeout(() => {
            expect(clearCacheStub.mock.calls.length).toBe(1);
            done();
        });
    });

});