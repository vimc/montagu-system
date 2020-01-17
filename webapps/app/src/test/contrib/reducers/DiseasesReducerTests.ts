

import {diseasesInitialState, diseasesReducer} from "../../../main/shared/reducers/diseasesReducer";
import { DiseasesTypes } from "../../../main/shared/actionTypes/DiseasesTypes";
import {mockDisease} from "../../mocks/mockModels";

describe('Diseases reducer tests', () => {

    const testDisease = {id: "disease-1", name: "Test 1"};

    it('sets fetched diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [testDisease]
        })).toEqual({...diseasesInitialState, diseases: [testDisease]});
    });

    it('orders diseases by name', () => {
        const a = mockDisease({ name: "A" });
        const b = mockDisease({ name: "B" });
        const c = mockDisease({ name: "C" });

        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [b, c, a]
        })).toEqual({...diseasesInitialState, diseases: [a, b, c]});
    });

    it('sets empty diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: null
        })).toEqual(diseasesInitialState);
    });

    it('sets current disease id', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: testDisease.id
        })).toEqual({...diseasesInitialState, currentDiseaseId: testDisease.id});
    });

    it('sets current disease id empty', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: null
        })).toEqual(diseasesInitialState);
    })
});