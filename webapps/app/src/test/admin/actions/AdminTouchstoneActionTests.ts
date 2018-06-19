import {adminTouchstoneActionCreators} from "../../../main/admin/actions/adminTouchstoneActionCreators";
import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";
import {verifyActionThatCallsServiceAndReturnsResult} from "../../ActionCreatorTestHelpers";

describe("Admin touchstone action tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore() );

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
});