import { expect } from "chai";
import alt from "../../main/alt";
import {
    mockCoverageSet,
    mockExtendedResponsibility,
    mockModellingGroup,
    mockResponsibility,
    mockResponsibilitySet,
    mockScenario,
    mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../mocks/mockModels";
import { ExtendedResponsibilitySet } from "../../main/contrib/models/ResponsibilitySet";
import { touchstoneActions } from "../../main/contrib/actions/TouchstoneActions";
import { responsibilityActions } from "../../main/contrib/actions/ResponsibilityActions";
import { responsibilityStore } from "../../main/contrib/stores/ResponsibilityStore";
import { coverageSetActions } from "../../main/contrib/actions/CoverageSetActions";
import { coverageTokenActions } from "../../main/contrib/actions/CoverageActions";
import { modellingGroupActions } from "../../main/contrib/actions/ModellingGroupActions";
import { makeLookup } from "../../main/contrib/stores/Loadable";
import { ModellingGroup } from "../../main/contrib/models/Generated";
const jwt = require("jsonwebtoken");

describe("ResponsibilityStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = responsibilityStore.getState();
        expect(state).to.eql({
            touchstones: [],
            currentTouchstone: null,

            responsibilitySet: null,
            currentResponsibility: null,

            currentModellingGroup: null,
            currentDiseaseId: null,

            coverageOneTimeToken: null,

            ready: false
        });
    });

    it("modellingGroupActions.setCurrentModellingGroup sets current modelling group", () => {
        const group = mockModellingGroup();
        alt.bootstrap(JSON.stringify({
            MainStore: { modellingGroups: makeLookup<ModellingGroup>([ group ]) }
        }));
        modellingGroupActions.setCurrentModellingGroup(group.id);
        expect(responsibilityStore.getState().currentModellingGroup).to.eql(group);
    });

    it("modellingGroupActions.update sets current modelling group if only a member of one", () => {
        // User has no membership of any group
        const group = mockModellingGroup();
        modellingGroupActions.update([ group ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.be.null;

        // User has membership of multiple groups
        alt.bootstrap(JSON.stringify({
            AuthStore: { modellingGroupIds: [ group.id, "another-id" ] }
        }));
        modellingGroupActions.update([ group ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.be.null;

        // User has membership of just one group
        alt.bootstrap(JSON.stringify({
            AuthStore: { modellingGroupIds: [ group.id ] }
        }));
        modellingGroupActions.update([ group ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.eql(group);
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

        const state = responsibilityStore.getState();
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
        const state = responsibilityStore.getState();
        expect(state.currentTouchstone).to.eql(touchstone);
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

        const state = responsibilityStore.getState();
        expect(state.ready).to.equal(false);
        expect(state.responsibilitySet).to.equal(null);
        expect(state.currentDiseaseId).to.equal(null);
    });

    it("responsibilityActions.filterByDisease sets currentDiseaseId", () => {
        responsibilityActions.filterByDisease("YF");

        const state = responsibilityStore.getState();
        expect(state.currentDiseaseId).to.equal("YF");
    });

    it("touchstoneActions.update sets touchstones", () => {
        const touchstones = [ mockTouchstone({ status: "finished" }) ];
        touchstoneActions.update(touchstones);

        const state = responsibilityStore.getState();
        expect(state.ready).to.equal(true);
        expect(state.touchstones).to.eql(touchstones);
        expect(state.currentTouchstone).to.be.null;
    });

    it("touchstoneActions.update sets current touchstone to open touchstone if any", () => {
        const touchstones = [
            mockTouchstone({ status: "finished" }),
            mockTouchstone({ status: "open" })
        ];
        touchstoneActions.update(touchstones);
        expect(responsibilityStore.getState().currentTouchstone).to.eql(touchstones[1]);
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

        const state = responsibilityStore.getState();
        expect(state.ready).to.equal(false);
        expect(state.touchstones).to.eql([]);
    });

    it("responsibilityActions.setCurrentResponsibility sets the current responsibility", () => {
        const scenario = mockScenario({ id: "scenario-special" });
        const responsibility = mockExtendedResponsibility({}, scenario);
        const responsibilities = [ responsibility, mockResponsibility() ];
        responsibilityActions.update(mockResponsibilitySet({}, responsibilities));

        responsibilityActions.setCurrentResponsibility(scenario.id);

        const state = responsibilityStore.getState();
        expect(state.currentResponsibility).to.eql(responsibility);
    });

    it("coverageSetActions.beginFetch sets ready to false", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
            }
        }));
        coverageSetActions.beginFetch();

        const state = responsibilityStore.getState();
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
        const responsibilities = responsibilityStore.getState().responsibilitySet.responsibilities;
        expect(responsibilities[0].coverageSets).to.equal(null);
        expect(responsibilities[1].coverageSets).to.equal(null);

        // Second, fire the event and check that the correct responsibility now has the coverage sets
        const coverageSets = [ mockCoverageSet() ];
        const payload = mockScenarioTouchstoneAndCoverageSets(scenario, touchstone, coverageSets);
        coverageSetActions.update(payload);

        const set = responsibilityStore.getState().responsibilitySet;
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

        const state = responsibilityStore.getState();
        expect(state.coverageOneTimeToken).to.equal(null);
    });

    it("coverageTokenActions.update sets the token", () => {
        coverageTokenActions.update("TOKEN");

        const state = responsibilityStore.getState();
        expect(state.coverageOneTimeToken).to.equal("TOKEN");
    });
});