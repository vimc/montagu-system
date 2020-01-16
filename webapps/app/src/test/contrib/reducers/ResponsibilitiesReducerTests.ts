

import { responsibilitiesReducer, responsibilitiesInitialState } from "../../../main/contrib/reducers/responsibilitiesReducer";
import { ResponsibilitiesTypes } from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {mockExtendedResponsibility, mockExtendedResponsibilitySet} from "../../mocks/mockModels";

describe('Responsibilities reducer tests', () => {

    const testExtResponsibilitySet = mockExtendedResponsibilitySet();
    const testExtResponsibility = mockExtendedResponsibility();

    it('sets responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: testExtResponsibilitySet
        })).toEqual({...responsibilitiesInitialState, responsibilitiesSet: testExtResponsibilitySet});
    });

    it('sets empty responsibility set', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
            data: null
        })).toEqual(responsibilitiesInitialState);
    });

    it('set current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: testExtResponsibility
        })).toEqual({...responsibilitiesInitialState, currentResponsibility: testExtResponsibility});
    });

    it('set empty current responsibility', () => {
        expect(responsibilitiesReducer(undefined, {
            type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
            data: null
        })).toEqual(responsibilitiesInitialState);
    });
});