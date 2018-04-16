import { expect } from "chai";

import { responsibilitiesReducer, responsibilitiesInitialState } from "../../../main/contrib/reducers/responsibilitiesReducer";
import { ResponsibilitiesTypes } from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {mockExtendedResponsibility, mockExtendedResponsibilitySet} from "../../mocks/mockModels";

const testExtResponsibilitySet = mockExtendedResponsibilitySet();
const testExtResponsibility = mockExtendedResponsibility();

describe('Responsibilities reducer tests', () => {
    it('sets responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: testExtResponsibilitySet
        })).to.eql({...responsibilitiesInitialState, responsibilitiesSet: testExtResponsibilitySet});
    });

    it('sets empty responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: null
        })).to.eql(responsibilitiesInitialState);
    });

    it('set current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: testExtResponsibility
        })).to.eql({...responsibilitiesInitialState, currentResponsibility: testExtResponsibility});
    });

    it('set empty current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: null
        })).to.eql(responsibilitiesInitialState);
    });
});