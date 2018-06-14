import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {touchstonesActionCreators} from "../../../main/contrib/actions/touchstonesActionCreators";
import {TouchstonesService} from "../../../main/contrib/services/TouchstonesService";
import {TouchstoneTypes} from "../../../main/contrib/actionTypes/TouchstonesTypes";
import {createMockContribStore} from "../../mocks/mockStore";
import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";
import {TouchstonesState} from "../../../main/contrib/reducers/touchstonesReducer";

describe("Touchstone actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();

    afterEach(() => {
        sandbox.restore();
    });

    it("touchstones fetched", (done) => {
        const store = createMockContribStore({});
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", () => {
            return Promise.resolve([testTouchstone]);
        });
        store.dispatch(touchstonesActionCreators.getTouchstonesByGroupId('group-1'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: TouchstoneTypes.TOUCHSTONES_FETCHED, data: [testTouchstone]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("set current touchstone by id using previously loaded touchstones", (done) => {
        const testTouchstoneVersion = mockTouchstoneVersion({"id": "touchstone-1"});
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [mockTouchstone({}, [testTouchstoneVersion])]
        };
        const store = createMockContribStore({touchstones: touchstonesState});
        store.dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion("touchstone-1"));
        setTimeout(() => {
            const actions = store.getActions();
            // console.log(actions);
            const expectedPayload = {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstoneVersion};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

});