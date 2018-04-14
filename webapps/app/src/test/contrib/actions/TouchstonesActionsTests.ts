import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { touchstonesActionCreators } from "../../../main/contrib/actions/touchstonesActionCreators";
import { TouchstonesService } from "../../../main/contrib/services/TouchstonesService";
import { TouchstoneTypes } from "../../../main/contrib/actionTypes/TouchstonesTypes";
import {createMockStore} from "../../mocks/mockStore";
import {mockTouchstone} from "../../mocks/mockModels";

describe("Touchstone actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone({id: "touchstone-1"});

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches action touchstones fetched after they are loaded", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", ()=>{
            return Promise.resolve([testTouchstone]);
        });
        store.dispatch(touchstonesActionCreators.getTouchstonesByGroupId('group-1'))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: TouchstoneTypes.TOUCHSTONES_FETCHED, data: [testTouchstone] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("dispatches action set current touchstone by id using previously loaded touchstones", (done) => {
        const initialState = {
            touchstones: {touchstones: [testTouchstone]}
        };
        const store = createMockStore(initialState);
        store.dispatch(touchstonesActionCreators.setCurrentTouchstone("touchstone-1"))
        setTimeout(() => {
            const actions = store.getActions()
            // console.log(actions);
            const expectedPayload = { type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE, data: testTouchstone }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});