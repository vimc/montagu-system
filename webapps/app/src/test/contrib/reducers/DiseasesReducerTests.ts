import { expect } from "chai";

import {diseasesInitialState, diseasesReducer} from "../../../main/contrib/reducers/diseasesReducer";
import { DiseasesTypes } from "../../../main/contrib/actionTypes/DiseasesTypes";

describe('Diseases reducer tests', () => {

    const testDisease = {id: "disease-1", name: "Test 1"};

    it('sets fetched diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [testDisease]
        })).to.eql({...diseasesInitialState, diseases: [testDisease]});
    });

    it('sets empty diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: null
        })).to.eql(diseasesInitialState);
    });

    it('sets current disease id', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: testDisease.id
        })).to.eql({...diseasesInitialState, currentDiseaseId: testDisease.id});
    });

    it('sets current disease id empty', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: null
        })).to.eql(diseasesInitialState);
    })
})