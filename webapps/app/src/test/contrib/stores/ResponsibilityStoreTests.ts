import { expect } from "chai";
import alt from "../../../main/shared/alt";
import {
    mockCoverageSet,
    mockExtendedResponsibility, mockExtendedResponsibilitySet,
    mockModellingGroup,
    mockResponsibility,
    mockResponsibilitySet,
    mockScenario,
    mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../../mocks/mockModels";
import { ExtendedResponsibilitySet } from "../../../main/contrib/models/ResponsibilitySet";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import { responsibilityActions } from "../../../main/contrib/actions/ResponsibilityActions";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { coverageSetActions } from "../../../main/contrib/actions/CoverageSetActions";
import { coverageTokenActions } from "../../../main/contrib/actions/CoverageActions";
import { modellingGroupActions } from "../../../main/shared/actions/ModellingGroupActions";
import { makeLoadable } from "../../../main/contrib/stores/Loadable";
import { ModellingGroup } from "../../../main/shared/models/Generated";
import { estimateTokenActions } from "../../../main/contrib/actions/EstimateActions";
import {modelParameterActions} from "../../../main/contrib/actions/ModelParameterActions";

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

            responsibilitySets: [],
            currentResponsibility: null,

            currentModellingGroup: null,
            currentDiseaseId: null,

            coverageOneTimeToken: null,
            estimatesOneTimeToken: null,
            parametersOneTimeToken: null,
            selectedFormat: "long",
            redirectPath: null,

            ready: false
        });
    });

    it("modellingGroupActions.setCurrentModellingGroup sets current modelling group", () => {
        const group = mockModellingGroup();
        alt.bootstrap(JSON.stringify({
            MainStore: { modellingGroups: makeLoadable<ModellingGroup>([ group ]) }
        }));
        modellingGroupActions.setCurrentGroup(group.id);
        expect(responsibilityStore.getState().currentModellingGroup).to.eql(group);
    });

    it("modellingGroupActions.update sets current modelling group if only a member of one", () => {
        // User has no membership of any group
        const group1 = mockModellingGroup({ id: "g1" });
        const group2 = mockModellingGroup({ id: "g2" });
        modellingGroupActions.updateGroups([ group1, group2 ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.be.null;

        // User has membership of multiple groups
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: { modellingGroupIds: [ group1.id, group2.id ] }
        }));
        modellingGroupActions.updateGroups([ group1, group2 ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.be.null;

        // User has membership of just one group
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: { modellingGroupIds: [ group1.id ] }
        }));
        modellingGroupActions.updateGroups([ group1, group2 ]);
        expect(responsibilityStore.getState().currentModellingGroup).to.eql(group1);
    });

    it("responsibilityActions.update sets current responsibility set", () => {
        const touchstone = mockTouchstone();
        const group = mockModellingGroup();
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                touchstones: [ touchstone ],
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                responsibilitySets: []
            }
        }));
        const responsibilitySet = mockResponsibilitySet({ touchstone: touchstone.id });
        responsibilityActions.update(responsibilitySet);

        const state = responsibilityStore.getState();
        expect(state.ready).to.equal(true);
        const expectedSet = new ExtendedResponsibilitySet(responsibilitySet, touchstone, group);
        expect(responsibilityStore.getCurrentResponsibilitySet()).to.eql(expectedSet);
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

    it("responsibilityActions.beginFetch clears current responsibility set", () => {
        const groupA = mockModellingGroup();
        const groupB = mockModellingGroup();
        const touchstoneA = mockTouchstone();
        const touchstoneB = mockTouchstone();
        alt.bootstrap(JSON.stringify({
            MainStore: {
                modellingGroups: makeLoadable([ groupA, groupB ])
            },
            ResponsibilityStore: {
                touchstones: [ touchstoneA, touchstoneB ],
                responsibilitySets: [
                    mockExtendedResponsibilitySet(null, null, touchstoneA, groupA),
                    mockExtendedResponsibilitySet(null, null, touchstoneA, groupB),
                    mockExtendedResponsibilitySet(null, null, touchstoneB, groupA),
                    mockExtendedResponsibilitySet(null, null, touchstoneB, groupB)
                ]
            }
        }));
        // Clear out the current one
        modellingGroupActions.setCurrentGroup(groupA.id);
        touchstoneActions.setCurrentTouchstone(touchstoneA.id);
        responsibilityActions.beginFetch();

        const manager = responsibilityStore.responsibilitySetManager();
        expect(manager.hasSet(groupA, touchstoneA)).to.equal(false,
            "Expected responsibility set for specified group and touchstone to be cleared");
        expect(manager.hasSet(groupA, touchstoneB)).to.be.true;
        expect(manager.hasSet(groupB, touchstoneA)).to.be.true;
        expect(manager.hasSet(groupB, touchstoneB)).to.be.true;
    });

    it("responsibilityActions.beginFetch clears current disease ID", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                ready: true,
                currentDiseaseId: "disease"
            }
        }));
        responsibilityActions.beginFetch();
        const state = responsibilityStore.getState();
        expect(state.ready).to.equal(false);
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
        const group = mockModellingGroup();
        const touchstone = mockTouchstone();
        const scenario = mockScenario({ id: "scenario-special" });
        const responsibility = mockExtendedResponsibility({}, scenario);
        const responsibilities = [ responsibility, mockResponsibility() ];
        alt.bootstrap(JSON.stringify({
            MainStore: { modellingGroups: makeLoadable([group]) },
            ResponsibilityStore: {
                touchstones: [ touchstone ],
                currentModellingGroup: group,
                currentTouchstone: touchstone,
                responsibilitySets: []
            }
        }));
        responsibilityActions.update(mockResponsibilitySet({ touchstone: touchstone.id}, responsibilities));
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
        const group = mockModellingGroup();
        const responsibility = mockResponsibility({}, scenario);
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                touchstones: [ touchstone ],
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                responsibilitySets: []
            }
        }));

        // First set up a responsibility set with two responsibilities with no coverage sets
        responsibilityActions.update(mockResponsibilitySet(
            { touchstone: touchstone.id },
            [ responsibility, mockResponsibility() ]
        ));
        const responsibilities = responsibilityStore.getCurrentResponsibilitySet().responsibilities;
        expect(responsibilities[0].coverageSets).to.equal(null);
        expect(responsibilities[1].coverageSets).to.equal(null);

        // Second fire the event and check that the correct responsibility now has the coverage sets
        const coverageSets = [ mockCoverageSet() ];
        const payload = mockScenarioTouchstoneAndCoverageSets(scenario, touchstone, coverageSets);
        coverageSetActions.update(payload);

        const set = responsibilityStore.getCurrentResponsibilitySet();
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

    it("records selected format", () => {
        coverageSetActions.selectFormat("wide");
        expect(responsibilityStore.getState().selectedFormat).to.equal("wide");
    });

    it("estimateTokenActions.clearUsedToken sets token to null", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                estimatesOneTimeToken: "TOKEN",
            }
        }));
        estimateTokenActions.clearUsedToken();

        const state = responsibilityStore.getState();
        expect(state.estimatesOneTimeToken).to.equal(null);
    });

    it("estimateTokenActions.clearUsedToken sets token to null", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                estimatesOneTimeToken: "TOKEN",
            }
        }));
        estimateTokenActions.clearUsedToken();

        const state = responsibilityStore.getState();
        expect(state.estimatesOneTimeToken).to.equal(null);
    });

    it("estimateTokenActions.update sets the token", () => {
        estimateTokenActions.update("TOKEN");

        const state = responsibilityStore.getState();
        expect(state.estimatesOneTimeToken).to.equal("TOKEN");
    });


    it("parameterTokenActions.clearUsedToken sets token to null", () => {
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                parametersOneTimeToken: "TOKEN",
            }
        }));
        modelParameterActions.clearUsedToken();

        const state = responsibilityStore.getState();
        expect(state.parametersOneTimeToken).to.equal(null);
    });

    it("parameterTokenActions.update sets the token", () => {
        modelParameterActions.update("TOKEN");

        const state = responsibilityStore.getState();
        expect(state.parametersOneTimeToken).to.equal("TOKEN");
    });
});