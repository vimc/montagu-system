import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../../main/shared/alt";

describe("ResponsibilityStore.fetchOneTimeCoverageToken", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, mockScenario({ id: "scenario-id"}));
    new FetchHelper<string>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage/get_onetime_link/",
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility
                }
            }));
        },
        triggerFetch: () => responsibilityStore.fetchOneTimeCoverageToken(),
        makePayload: () => "TOKEN"
    }).addTestsToMocha();
});