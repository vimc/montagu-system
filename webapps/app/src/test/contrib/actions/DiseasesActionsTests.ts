import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { diseasesActionCreators } from "../../../main/contrib/actions/diseasesActionCreators";
import { DiseasesService } from "../../../main/contrib/services/DiseasesService";
import { DiseasesTypes } from "../../../main/contrib/actionTypes/DiseasesTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Diseases actions tests", () => {
    const sandbox = new Sandbox();

    const testDisease = {id: "disease-1", name: "Test 1"};

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches action all diseases fetched", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(DiseasesService.prototype, "getAllDiseases", ()=>{
          return Promise.resolve([testDisease]);
        });
        store.dispatch(diseasesActionCreators.getAllDiseases())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("dispatches action set current disease id", (done) => {
        const initialState = {
            diseases: {diseases: [testDisease]}
        };
        const store = createMockStore(initialState);
        store.dispatch(diseasesActionCreators.setCurrentDiseaseId("disease-1"))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID, data: testDisease.id }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});