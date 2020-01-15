import {expect} from "chai";

import {Sandbox} from "../../Sandbox";

import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";
import {touchstonesActionCreators} from "../../../main/shared/actions/touchstoneActionCreators";
import {TouchstoneTypes} from "../../../main/shared/actionTypes/TouchstonesTypes";

describe("Shared touchstone actions tests", () => {
    const sandbox = new Sandbox();



    afterEach(() => {
        sandbox.restore();
    });

    test(
        "setCurrentTouchstoneVersion dispatches SET_CURRENT_TOUCHSTONE_VERSION",
        () => {

            const testTouchstoneVersion = mockTouchstoneVersion({id: "t-1"});
            const touchstones = [mockTouchstone({}, [testTouchstoneVersion]), mockTouchstone()];
            const result = touchstonesActionCreators.setCurrentTouchstoneVersion("t-1", touchstones);
            expect(result).to.deep.eq({type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION, data: testTouchstoneVersion})
        }
    );

});