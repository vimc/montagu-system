import { expect } from "chai";

import {touchstonesInitialState, touchstonesReducer} from "../../../main/contrib/reducers/touchstonesReducer";
import { TouchstoneTypes } from "../../../main/contrib/actionTypes/TouchstonesTypes";
import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";

describe('Touchstones reducer tests', () => {
    it('sets fetched touchstones', () => {
        const testTouchstone = mockTouchstone();
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED,
            data: [testTouchstone]
        })).to.eql({...touchstonesInitialState, touchstones: [testTouchstone]});
    });

    it('sets empty fetched touchstones', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED,
            data: null
        })).to.eql(touchstonesInitialState);
    });

    it('sets current touchstone', () => {
        const testTouchstoneVersion = mockTouchstoneVersion();
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: testTouchstoneVersion
        })).to.eql({...touchstonesInitialState, currentTouchstoneVersion: testTouchstoneVersion});
    });

    it('sets current touchstone empty', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: null
        })).to.eql(touchstonesInitialState);
    });
});