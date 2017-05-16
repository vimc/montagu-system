import { expect } from "chai";
import alt from "../../main/alt";
import { mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";
const jwt = require("jsonwebtoken");

import { Store } from "../../main/stores/ResponsibilityStore";
import { responsibilityActions } from "../../main/actions/ResponsibilityActions";
import { authActions } from "../../main/actions/AuthActions";

describe("ResponsibilityStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            ready: false,
            currentModellingGroupId: null,
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
            ready: true,
            currentTouchstone: null,
            currentModellingGroupId: null,
            responsibilitySet: responsibilitySet,
            currentDiseaseId: null
        });
    });

    it("setTouchstone sets touchstone", () => {
        const touchstone = mockTouchstone();
        responsibilityActions.setTouchstone(touchstone);
        const state = Store.getState();
        expect(state.currentTouchstone).to.equal(touchstone);
    });

    it("logIn sets modelling group id", () => {
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login",
            roles: "modelling-group:test.group/member"
        }, 'secret');
        authActions.logIn(token);
        const state = Store.getState();
        expect(state.currentModellingGroupId).to.equal("test.group");
    });

    it("beginFetch clears everything except currentTouchstone and currentModellingGroupId", () => {
        const touchstone = mockTouchstone();
        // First set us up in a state where everything is non-null
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
                currentTouchstone: touchstone,
                currentModellingGroupId: "id",
                responsibilitySet: mockResponsibilitySet(),
                currentDiseaseId: "disease"
            }
        }));
        responsibilityActions.beginFetch();

        const state = Store.getState();
        expect(state).to.eql({
            ready: false,
            currentTouchstone: touchstone,
            currentModellingGroupId: "id",
            responsibilitySet: null,
            currentDiseaseId: null
        });
    });

    it("filterByDisease sets currentDiseaseId", () => {
        responsibilityActions.filterByDisease("YF");

        const state = Store.getState();
        expect(state).to.eql({
            ready: false,
            currentTouchstone: null,
            currentModellingGroupId: null,
            responsibilitySet: null,
            currentDiseaseId: "YF"
        });
    });
});