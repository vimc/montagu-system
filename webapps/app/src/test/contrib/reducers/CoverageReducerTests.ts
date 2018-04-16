import { expect } from "chai";

import {coverageInitialState, coverageReducer} from "../../../main/contrib/reducers/coverageReducer";
import {Coverage, CoverageTypes} from "../../../main/contrib/actionTypes/CoverageTypes";
import {mockCoverageSet} from "../../mocks/mockModels";

const testCoverageDataSet = mockCoverageSet();

describe('Coverage reducer tests', () => {
    it('sets fetched data sets', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: [testCoverageDataSet]
        })).to.eql({...coverageInitialState, dataSets: [testCoverageDataSet]});
    })

    it('sets fetched empty data sets', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: null
        })).to.eql(coverageInitialState);
    })

    it('sets format', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: Coverage.SelectedFormat.wide
        })).to.eql({...coverageInitialState, selectedFormat: 'wide'});
    })

    it('sets empty format, get default format', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: null
        })).to.eql(coverageInitialState);
    })

    it('sets fetched token', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql({...coverageInitialState, token: 'test-token'});
    })

    it('sets empty fetched token', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(coverageInitialState);
    })

    it('clears token', () => {
        expect(coverageReducer({...coverageInitialState, token: 'some-token'}, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(coverageInitialState);
    })
})