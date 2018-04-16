import { expect } from "chai";

import {demographicInitialState, demographicReducer} from "../../../main/contrib/reducers/demographicReducer";
import {Demographic, DemographicTypes} from "../../../main/contrib/actionTypes/DemographicTypes";
import {mockDemographicDataset} from "../../mocks/mockModels";

const testDemographicDataSet = mockDemographicDataset({id: 'type-1'});

describe('Demographic reducer tests', () => {
    it('adds fetched data sets to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: [testDemographicDataSet]
        })).to.eql(
            {
                dataSets: [testDemographicDataSet],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('adds fetched empty data sets to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('adds selected data sets to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: testDemographicDataSet
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: testDemographicDataSet,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('adds empty selected data sets to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('sets selected format to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: Demographic.SelectedFormat.wide
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "wide",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('sets selected empty format to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('sets selected gender to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: Demographic.SelectedGender.female
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "female",
                token: null
            }
        )
    })

    it('sets selected empty gender to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('sets fetched token to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: 'test-token'
            }
        )
    })

    it('sets empty fetched token to the state', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })

    it('clears token in the state', () => {
        const state = demographicInitialState;
        state.token = 'some-token';
        expect(demographicReducer(state, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(
            {
                dataSets: [],
                selectedDataSet: null,
                selectedFormat: "long",
                selectedGender: "both",
                token: null
            }
        )
    })
})