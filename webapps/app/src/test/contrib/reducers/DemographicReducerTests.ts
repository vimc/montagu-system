

import {mockDemographicDataset} from "../../mocks/mockModels";
import {Demographic, DemographicTypes} from "../../../main/shared/actionTypes/DemographicTypes";
import {demographicsInitialState, demographicsReducer} from "../../../main/shared/reducers/demographicsReducer";

describe('Demographic reducer tests', () => {

    const testDemographicDataSet = mockDemographicDataset({id: 'type-1'});

    it('sets fetched data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: [testDemographicDataSet]
        })).toEqual({...demographicsInitialState, dataSets: [testDemographicDataSet]});
    });

    it('sets fetched empty data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
            data: null
        })).toEqual(demographicsInitialState);
    });

    it('sets selected data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: testDemographicDataSet
        })).toEqual({...demographicsInitialState, selectedDataSet: testDemographicDataSet});
    });

    it('sets empty selected data sets', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
            data: null
        })).toEqual(demographicsInitialState);
    });

    it('sets selected format', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: Demographic.SelectedFormat.wide
        })).toEqual({...demographicsInitialState, selectedFormat: 'wide'});
    });

    it('sets selected empty format', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: null
        })).toEqual(demographicsInitialState);
    });

    it('sets selected gender', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: Demographic.SelectedGender.female
        })).toEqual({...demographicsInitialState, selectedGender: 'female'});
    });

    it('sets selected empty gender', () => {
        expect(demographicsReducer(undefined, {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: null
        })).toEqual(demographicsInitialState);
    });
});