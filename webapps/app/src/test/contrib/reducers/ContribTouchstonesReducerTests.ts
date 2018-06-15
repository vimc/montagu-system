import { expect } from "chai";

import {touchstonesInitialState, contribTouchstonesReducer} from "../../../main/contrib/reducers/contribTouchstonesReducer";
import { TouchstoneTypes } from "../../../main/shared/actionTypes/TouchstonesTypes";
import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";

describe('Contrib touchstones reducer tests', () => {
    it('sets fetched touchstones', () => {
        const testTouchstone = mockTouchstone();
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
            data: [testTouchstone]
        })).to.eql({...touchstonesInitialState, touchstones: [testTouchstone]});
    });

    it('sets empty fetched touchstones', () => {
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
            data: null
        })).to.eql(touchstonesInitialState);
    });

    it('sets current touchstone', () => {
        const testTouchstoneVersion = mockTouchstoneVersion();
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: testTouchstoneVersion
        })).to.eql({...touchstonesInitialState, currentTouchstoneVersion: testTouchstoneVersion});
    });

    it('sets current touchstone empty', () => {
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: null
        })).to.eql(touchstonesInitialState);
    });
});