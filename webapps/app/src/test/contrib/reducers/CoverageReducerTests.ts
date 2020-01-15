import { expect } from "chai";

import {coverageInitialState, coverageReducer} from "../../../main/contrib/reducers/coverageReducer";
import {Coverage, CoverageTypes} from "../../../main/contrib/actionTypes/CoverageTypes";
import {mockCoverageSet} from "../../mocks/mockModels";

describe('Coverage reducer tests', () => {

    const testCoverageDataSet = mockCoverageSet();

    test('sets fetched data sets', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: [testCoverageDataSet]
        })).to.eql({...coverageInitialState, dataSets: [testCoverageDataSet]});
    });

    test('sets fetched empty data sets', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: null
        })).to.eql(coverageInitialState);
    });

    test('sets format', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: Coverage.SelectedFormat.wide
        })).to.eql({...coverageInitialState, selectedFormat: 'wide'});
    });

    test('sets empty format, get default format', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: null
        })).to.eql(coverageInitialState);
    });
});