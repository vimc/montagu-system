import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { contribTouchstonesActionCreators } from "../../../main/contrib/actions/contribTouchstonesActionCreators";
import { TouchstonesService } from "../../../main/shared/services/TouchstonesService";
import { TouchstoneTypes } from "../../../main/shared/actionTypes/TouchstonesTypes";
import {createMockStore} from "../../mocks/mockStore";
import {mockTouchstone} from "../../mocks/mockModels";

describe("Touchstone actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone({id: "touchstone-1"});

    afterEach(() => {
        sandbox.restore();
    });

    it("touchstones fetched", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", ()=>{
            return Promise.resolve([testTouchstone]);
        });
        store.dispatch(contribTouchstonesActionCreators.getTouchstonesByGroupId('group-1'))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP, data: [testTouchstone] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("set current touchstone by id using previously loaded touchstones", (done) => {
        const initialState = {
            touchstones: {touchstones: [testTouchstone]}
        };
        const store = createMockStore(initialState);
        store.dispatch(contribTouchstonesActionCreators.setCurrentTouchstone("touchstone-1"))
        setTimeout(() => {
            const actions = store.getActions()
            // console.log(actions);
            const expectedPayload = { type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE, data: testTouchstone }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});