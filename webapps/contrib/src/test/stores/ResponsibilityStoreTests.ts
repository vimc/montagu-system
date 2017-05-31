import { expect } from "chai";
import alt from "../../main/alt";
import {
    mockCoverageSet,
    mockExtendedResponsibility,
    mockExtendedResponsibilitySet,
    mockResponsibility,
    mockResponsibilitySet,
    mockScenario, mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../mocks/mockModels";
import { authActions } from "../../main/actions/AuthActions";
import { ExtendedResponsibilitySet } from "../../main/models/ResponsibilitySet";
const jwt = require("jsonwebtoken");

import { touchstoneActions } from "../../main/actions/TouchstoneActions";
import { responsibilityActions } from "../../main/actions/ResponsibilityActions";
import { Store } from "../../main/stores/ResponsibilityStore";
import { coverageSetActions } from "../../main/actions/CoverageSetActions";
import { coverageTokenActions } from "../../main/actions/CoverageActions";

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

            coverageOneTimeToken: null,

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

    it("responsibilityActions.setCurrentResponsibility sets the current responsibility", () => {
        const scenario = mockScenario({ id: "scenario-special" });
        const responsibility = mockExtendedResponsibility({}, scenario);
        const responsibilities = [ responsibility, mockResponsibility() ];
        responsibilityActions.update(mockResponsibilitySet({}, responsibilities));

        responsibilityActions.setCurrentResponsibility(scenario.id);

        const state = Store.getState();
        expect(state.currentResponsibility).to.eql(responsibility);
    });

    it("coverageSetActions.beginFetch sets ready to false", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
            }
        }));
        coverageSetActions.beginFetch();

        const state = Store.getState();
        expect(state.ready).to.equal(false);
    });

    it("coverageSetActions.update updates the correct responsibilities coverage sets", () => {
        const scenario = mockScenario({ id: "scenario-special" });
        const touchstone = mockTouchstone();

        // First, set up a responsibility set that doesn't have any coverage sets
        const responsibility = mockResponsibility({}, scenario);
        const inputSet = mockResponsibilitySet(
            { touchstone: touchstone.id },
            [ responsibility, mockResponsibility() ]
        );
        responsibilityActions.update(inputSet);
        const responsibilities = Store.getState().responsibilitySet.responsibilities;
        expect(responsibilities[0].coverageSets).to.equal(null);
        expect(responsibilities[1].coverageSets).to.equal(null);

        // Second, fire the event and check that the correct responsibility now has the coverage sets
        const coverageSets = [ mockCoverageSet() ];
        const payload = mockScenarioTouchstoneAndCoverageSets(scenario, touchstone, coverageSets);
        coverageSetActions.update(payload);

        const set = Store.getState().responsibilitySet;
        expect(set.responsibilities[0].coverageSets).to.equal(coverageSets);
        expect(set.responsibilities[1].coverageSets).to.equal(null);
        expect(set.getResponsibilityByScenario(scenario.id).coverageSets).to.eql(coverageSets);
    });

    it("coverageTokenActions.clearUsedToken sets token to null", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                coverageOneTimeToken: "TOKEN",
            }
        }));
        coverageTokenActions.clearUsedToken();

        const state = Store.getState();
        expect(state.coverageOneTimeToken).to.equal(null);
    });

    it("coverageTokenActions.update sets the token", () => {
        coverageTokenActions.update("TOKEN");

        const state = Store.getState();
        expect(state.coverageOneTimeToken).to.equal("TOKEN");
    });
});