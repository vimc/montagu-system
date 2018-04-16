import { expect } from "chai";

import {touchstonesInitialState, touchstonesReducer} from "../../../main/contrib/reducers/touchstonesReducer";
import { TouchstoneTypes } from "../../../main/contrib/actionTypes/TouchstonesTypes";
import {mockTouchstone} from "../../mocks/mockModels";

const testTouchstone = mockTouchstone({id: "touchstone-1"});

describe('Touchstones reducer tests', () => {

    it('sets fetched touchstones', () => {
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
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: testTouchstone
        })).to.eql({...touchstonesInitialState, currentTouchstone: testTouchstone});
    });

    it('sets current touchstone empty', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: null
        })).to.eql(touchstonesInitialState);
    });
})