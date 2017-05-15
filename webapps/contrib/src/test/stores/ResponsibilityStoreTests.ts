import { expect } from "chai";
import alt from "../../main/alt";
import { mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";

import { Store } from "../../main/stores/ResponsibilityStore";
import { responsibilityActions } from "../../main/actions/ResponsibilityActions";

describe("ResponsibilityStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: null,
            responsibilitySet: null,
            currentDiseaseId: null
        });
    });

    it("updateResponsibilities sets responsibility set", () => {
        const responsibilitySet = mockResponsibilitySet({});
        responsibilityActions.update(responsibilitySet);

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: true,
            currentTouchstone: null,
            responsibilitySet: responsibilitySet,
            currentDiseaseId: null
        });
    });

    it("beginFetch clears everything except currentTouchstone", () => {
        const touchstone = mockTouchstone()
        // First set us up in an impossible state where everything is non-null
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                errorMessage: "message",
                ready: true,
                currentTouchstone: touchstone,
                responsibilitySet: mockResponsibilitySet(),
                currentDiseaseId: "disease"
            }
        }));
        responsibilityActions.beginFetch();

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: touchstone,
            responsibilitySet: null,
            currentDiseaseId: null
        });
    });

    it("filterByDisease sets currentDiseaseId", () => {
        responsibilityActions.filterByDisease("YF");

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: null,
            responsibilitySet: null,
            currentDiseaseId: "YF"
        });
    });
});