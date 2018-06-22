import {adminTouchstoneActionCreators} from "../../../main/admin/actions/adminTouchstoneActionCreators";
import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {verifyActionThatCallsServiceAndReturnsResult} from "../../ActionCreatorTestHelpers";
import {touchstonesActionCreators} from "../../../main/shared/actions/touchstoneActionCreators";
import {mockTouchstone} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {expect} from "chai";

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

    it("sets current touchstone if exists", async () => {
        const touchstone = mockTouchstone({id: "tId"});
        const options = [touchstone, mockTouchstone()];
        expect(touchstonesActionCreators.setCurrentTouchstone("tId", options)).to.eql({
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: touchstone
        });
    });

    it("setCurrentTouchstone throws exception if touchstone does not exist", async () => {
        const options = [mockTouchstone(), mockTouchstone()];
        expect(() => touchstonesActionCreators.setCurrentTouchstone("tId", options)).to.throw;
    });
});