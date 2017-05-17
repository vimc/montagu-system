import { expect } from "chai";
import alt from "../../main/alt";
import { mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";
const jwt = require("jsonwebtoken");

import { Store } from "../../main/stores/ResponsibilityStore";
import { responsibilityActions } from "../../main/actions/ResponsibilityActions";
import { authActions } from "../../main/actions/AuthActions";
import { touchstoneActions } from "../../main/actions/TouchstoneActions";
import { ExtendedResponsibilitySet } from "../../main/models/ResponsibilitySet";

describe("ResponsibilityStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            touchstones: [],
            currentTouchstone: null,

            responsibilitySet: null,
            currentResponsibility: null,

            currentModellingGroupId: null,
            currentDiseaseId: null,

            ready: false
        });
    });

    it("responsibilityActions.update sets responsibility set", () => {
        const touchstone = mockTouchstone();
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                touchstones: [ touchstone ]
            }
        }));
        const responsibilitySet = mockResponsibilitySet({ touchstone: touchstone.id });
        responsibilityActions.update(responsibilitySet);

        const state = Store.getState();
        expect(state.ready).to.equal(true);
        expect(state.responsibilitySet).to.eql(new ExtendedResponsibilitySet(responsibilitySet, touchstone));
    });

    it("touchstoneActions.setCurrentTouchstone sets touchstone", () => {
        const touchstone = mockTouchstone();
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                touchstones: [ touchstone ]
            }
        }));

        touchstoneActions.setCurrentTouchstone(touchstone.id);
        const state = Store.getState();
        expect(state.currentTouchstone).to.eql(touchstone);
    });

    it("authActions.logIn sets modelling group id", () => {
        const token = jwt.sign({
            sub: "test.user",
            permissions: "*/can-login",
            roles: "modelling-group:test.group/member"
        }, 'secret');
        authActions.logIn(token);
        const state = Store.getState();
        expect(state.currentModellingGroupId).to.equal("test.group");
    });

    it("responsibilityActions.beginFetch clears responsibilities", () => {
        // First set us up in a state where everything is non-null
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
                responsibilitySet: mockResponsibilitySet(),
                currentDiseaseId: "disease"
            }
        }));
        responsibilityActions.beginFetch();

        const state = Store.getState();
        expect(state.ready).to.equal(false);
        expect(state.responsibilitySet).to.equal(null);
        expect(state.currentDiseaseId).to.equal(null);
    });

    it("responsibilityActions.filterByDisease sets currentDiseaseId", () => {
        responsibilityActions.filterByDisease("YF");

        const state = Store.getState();
        expect(state.currentDiseaseId).to.equal("YF");
    });

    it("touchstoneActions.update sets touchstones", () => {
        const touchstones = [ mockTouchstone({ status: "finished" }) ];
        touchstoneActions.update(touchstones);

        const state = Store.getState();
        expect(state.ready).to.equal(true);
        expect(state.touchstones).to.eql(touchstones);
    });

    it("touchstoneActions.beginFetch clears touchstones", () => {
        // First set us up in a state where everything is non-null
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
                touchstones: [ mockTouchstone({}) ]
            }
        }));
        touchstoneActions.beginFetch();

        const state = Store.getState();
        expect(state.ready).to.equal(false);
        expect(state.touchstones).to.eql([]);
    });
});