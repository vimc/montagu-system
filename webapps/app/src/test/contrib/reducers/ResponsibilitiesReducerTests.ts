import { expect } from "chai";

import { responsibilitiesReducer, responsibilitiesInitialState } from "../../../main/contrib/reducers/responsibilitiesReducer";
import { ResponsibilitiesTypes } from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {mockExtendedResponsibility, mockExtendedResponsibilitySet} from "../../mocks/mockModels";

const testExtResponsibilitySet = mockExtendedResponsibilitySet();
const testExtResponsibility = mockExtendedResponsibility();

describe('Responsibilities reducer tests', () => {
    it('set responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: testExtResponsibilitySet
        })).to.eql(
            {
                responsibilitiesSet: testExtResponsibilitySet,
                currentResponsibility: null
            }
        )
    })

    it('set empty responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: null
        })).to.eql(
            {
                responsibilitiesSet: null,
                currentResponsibility: null
            }
        )
    })

    it('set current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: testExtResponsibility
        })).to.eql(
            {
                responsibilitiesSet: null,
                currentResponsibility: testExtResponsibility
            }
        )
    })

    it('set empty current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: null
        })).to.eql(
            {
                responsibilitiesSet: null,
                currentResponsibility: null
            }
        )
    })

})