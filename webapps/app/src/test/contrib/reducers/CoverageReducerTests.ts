import { expect } from "chai";

import {coverageInitialState, coverageReducer} from "../../../main/contrib/reducers/coverageReducer";
import {Coverage, CoverageTypes} from "../../../main/contrib/actionTypes/CoverageTypes";
import {mockCoverageSet} from "../../mocks/mockModels";

const testCoverageDataSet = mockCoverageSet();

describe('Coverage reducer tests', () => {
    it('adds fetched data sets to the state', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: [testCoverageDataSet]
        })).to.eql(
            {
                dataSets: [testCoverageDataSet],
                selectedFormat: "long",
                token: null
            }
        )
    })

    it('adds fetched empty data sets to the state', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "long",
                token: null
            }
        )
    })

    it('adds format to the state', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: Coverage.SelectedFormat.wide
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "wide",
                token: null
            }
        )
    })

    it('adds empty format to the state, get default format, which is long', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "long",
                token: null
            }
        )
    })

    it('sets fetched token to the state', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "long",
                token: 'test-token'
            }
        )
    })

    it('sets empty fetched token to the state', () => {
        expect(coverageReducer(undefined, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "long",
                token: null
            }
        )
    })

    it('clears token in the state', () => {
        const state = coverageInitialState;
        state.token = 'some-token';
        expect(coverageReducer(state, {
            type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(
            {
                dataSets: [],
                selectedFormat: "long",
                token: null
            }
        )
    })
})