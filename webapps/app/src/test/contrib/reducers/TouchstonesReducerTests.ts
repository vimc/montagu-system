import { expect } from "chai";

import {touchstonesInitialState, contribTouchstonesReducer} from "../../../main/contrib/reducers/contribTouchstonesReducer";
import { TouchstoneTypes } from "../../../main/shared/actionTypes/TouchstonesTypes";
import {mockTouchstone} from "../../mocks/mockModels";

describe('Touchstones reducer tests', () => {

    const testTouchstone = mockTouchstone({id: "touchstone-1"});

    it('sets fetched touchstones', () => {
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
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: testTouchstone
        })).to.eql({...touchstonesInitialState, currentTouchstone: testTouchstone});
    });

    it('sets current touchstone empty', () => {
        expect(contribTouchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: null
        })).to.eql(touchstonesInitialState);
    });
})