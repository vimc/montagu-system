import { expect } from "chai";

import {demographicInitialState, demographicReducer} from "../../../main/contrib/reducers/demographicReducer";
import {Demographic, DemographicTypes} from "../../../main/contrib/actionTypes/DemographicTypes";
import {mockDemographicDataset} from "../../mocks/mockModels";

const testDemographicDataSet = mockDemographicDataset({id: 'type-1'});

describe('Demographic reducer tests', () => {

    it('sets fetched data sets', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: [testDemographicDataSet]
        })).to.eql({...demographicInitialState, dataSets: [testDemographicDataSet]});
    })

    it('sets fetched empty data sets', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: null
        })).to.eql(demographicInitialState);
    })

    it('sets selected data sets', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: testDemographicDataSet
        })).to.eql({...demographicInitialState, selectedDataSet: testDemographicDataSet});
    })

    it('sets empty selected data sets', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: null
        })).to.eql(demographicInitialState);
    })

    it('sets selected format', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: Demographic.SelectedFormat.wide
        })).to.eql({...demographicInitialState, selectedFormat: 'wide'});
    })

    it('sets selected empty format', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: null
        })).to.eql(demographicInitialState);
    })

    it('sets selected gender', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: Demographic.SelectedGender.female
        })).to.eql({...demographicInitialState, selectedGender: 'female'});
    })

    it('sets selected empty gender', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: null
        })).to.eql(demographicInitialState);
    })

    it('sets fetched token', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql({...demographicInitialState, token: 'test-token'});
    })

    it('sets empty fetched token', () => {
        expect(demographicReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(demographicInitialState);
    })

    it('clears token', () => {
        expect(demographicReducer({...demographicInitialState, token: 'some-token'}, {
            type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(demographicInitialState)
    })
})