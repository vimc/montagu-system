import {
    mockBurdenEstimateSet, mockModellingGroup, mockResponsibility, mockScenario,
    mockTouchstone
} from "../../mocks/mockModels";
import {FetchHelper} from "../../shared/fetch/helpers";
import {responsibilityStore} from "../../../main/contrib/stores/ResponsibilityStore";
import {alt} from "../../../main/shared/alt";
import {expect} from "chai"

describe("ResponsibilityStore.fetchOneTimeEstimatesToken with redirect path", () => {
    const group = mockModellingGroup({id: "group-id"});
    const touchstone = mockTouchstone({id: "touchstone-id"});
    const responsibility = mockResponsibility({current_estimate_set: mockBurdenEstimateSet({id: 123})},
        mockScenario({id: "scenario-id"}));

    new FetchHelper<string, string>(
        {
            expectedURL:
                "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/estimate-sets/123/get_onetime_link/?redirectUrl=http://localhost:5000/redirect/to",
            prepareForFetch: () => {
                alt.bootstrap(JSON.stringify({
                    ResponsibilityStore: {
                        currentTouchstone: touchstone,
                        currentModellingGroup: group,
                        currentResponsibility: responsibility,
                        redirectPath: "/redirect/to"
                    }
                }));
            },
            triggerFetch: () => responsibilityStore.fetchOneTimeEstimatesToken(),
            makePayload: () => "TOKEN"
        }).addTestsToMocha();
});

describe("ResponsibilityStore.fetchOneTimeEstimatesToken without redirect path", () => {
    const group = mockModellingGroup({id: "group-id"});
    const touchstone = mockTouchstone({id: "touchstone-id"});
    const responsibility = mockResponsibility({current_estimate_set: mockBurdenEstimateSet({id: 123})},
        mockScenario({id: "scenario-id"}));

    new FetchHelper<string, string>(
        {
            expectedURL:
                "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/estimate-sets/123/get_onetime_link/",
            prepareForFetch: () => {
                alt.bootstrap(JSON.stringify({
                    ResponsibilityStore: {
                        currentTouchstone: touchstone,
                        currentModellingGroup: group,
                        currentResponsibility: responsibility,
                        redirectPath: null
                    }
                }));
            },
            triggerFetch: () => responsibilityStore.fetchOneTimeEstimatesToken(),
            makePayload: () => "TOKEN"
        }).addTestsToMocha();
});

describe("ResponsibilityStore.fetchOneTimeEstimatesToken without current estimate set", () => {
    const group = mockModellingGroup({id: "group-id"});
    const touchstone = mockTouchstone({id: "touchstone-id"});
    const responsibility = mockResponsibility({}, mockScenario({id: "scenario-id"}));

    responsibilityStore.fetchOneTimeEstimatesToken().then((token)=>{
        expect(token).to.null;
    });
});