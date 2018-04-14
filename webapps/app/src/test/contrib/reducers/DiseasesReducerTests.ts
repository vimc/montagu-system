import { expect } from "chai";

import { diseasesReducer } from "../../../main/contrib/reducers/diseasesReducer";
import { DiseasesTypes } from "../../../main/contrib/actionTypes/DiseasesTypes";

const testDisease = {id: "disease-1", name: "Test 1"};

describe('Diseases reducer tests', () => {
    it('set new state with diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: [testDisease]
        })).to.eql(
            {
                diseases: [testDisease],
                currentDiseaseId: null
            }
        )
    })

    it('sets new state with empty diseases', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_FETCHED,
            data: null
        })).to.eql(
            {
                diseases: null,
                currentDiseaseId: null
            }
        )
    })

    it('sets new state with current disease id', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: testDisease.id
        })).to.eql(
            {
                diseases: [],
                currentDiseaseId: testDisease.id
            }
        )
    })

    it('sets new state with current disease id empty', () => {
        expect(diseasesReducer(undefined, {
            type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
            data: null
        })).to.eql(
            {
                diseases: [],
                currentDiseaseId: null
            }
        )
    })
})