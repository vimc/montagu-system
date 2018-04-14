import { expect } from "chai";

import { touchstonesReducer } from "../../../main/contrib/reducers/touchstonesReducer";
import { TouchstoneTypes } from "../../../main/contrib/actionTypes/TouchstonesTypes";
import {mockTouchstone} from "../../mocks/mockModels";

const testTouchstone = mockTouchstone({id: "touchstone-1"});

describe('Touchstones reducer tests', () => {
    it('set new state with touchstones', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED,
            data: [testTouchstone]
        })).to.eql(
            {
                touchstones: [testTouchstone],
                currentTouchstone: null
            }
        )
    })

    it('sets new state with empty touchstones', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.TOUCHSTONES_FETCHED,
            data: null
        })).to.eql(
            {
                touchstones: null,
                currentTouchstone: null
            }
        )
    })

    it('sets new state with current touchstone', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: testTouchstone
        })).to.eql(
            {
                touchstones: [],
                currentTouchstone: testTouchstone
            }
        )
    })

    it('sets new state with current touchstone empty', () => {
        expect(touchstonesReducer(undefined, {
            type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
            data: null
        })).to.eql(
            {
                touchstones: [],
                currentTouchstone: null
            }
        )
    })
})