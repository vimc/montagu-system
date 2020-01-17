

import {touchstonesInitialState, contribTouchstonesReducer} from "../../../main/contrib/reducers/contribTouchstonesReducer";
import { TouchstoneTypes } from "../../../main/shared/actionTypes/TouchstonesTypes";
import {mockTouchstone, mockTouchstoneVersion} from "../../mocks/mockModels";

describe('Contrib touchstones reducer tests', () => {
    it('sets fetched touchstones', () => {
        const testTouchstone = mockTouchstone();
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
            data: [testTouchstone]
        })).toEqual({...touchstonesInitialState, touchstones: [testTouchstone]});
    });

    it('sets empty fetched touchstones', () => {
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
            data: null
        })).toEqual(touchstonesInitialState);
    });

    it('sets current touchstone', () => {
        const testTouchstoneVersion = mockTouchstoneVersion();
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: testTouchstoneVersion
        })).toEqual({...touchstonesInitialState, currentTouchstoneVersion: testTouchstoneVersion});
    });

    it('sets current touchstone empty', () => {
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
            data: null
        })).toEqual(touchstonesInitialState);
    });
});