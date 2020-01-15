import { expect } from "chai";

import {diseasesInitialState, diseasesReducer} from "../../../main/shared/reducers/diseasesReducer";
import { DiseasesTypes } from "../../../main/shared/actionTypes/DiseasesTypes";
import {mockDisease} from "../../mocks/mockModels";

describe('Diseases reducer tests', () => {

    const testDisease = {id: "disease-1", name: "Test 1"};

    test('sets fetched diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [testDisease]
        })).to.eql({...diseasesInitialState, diseases: [testDisease]});
    });

    test('orders diseases by name', () => {
        const a = mockDisease({ name: "A" });
        const b = mockDisease({ name: "B" });
        const c = mockDisease({ name: "C" });

        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [b, c, a]
        })).to.eql({...diseasesInitialState, diseases: [a, b, c]});
    });

    test('sets empty diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: null
        })).to.eql(diseasesInitialState);
    });

    test('sets current disease id', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: testDisease.id
        })).to.eql({...diseasesInitialState, currentDiseaseId: testDisease.id});
    });

    test('sets current disease id empty', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: null
        })).to.eql(diseasesInitialState);
    })
});