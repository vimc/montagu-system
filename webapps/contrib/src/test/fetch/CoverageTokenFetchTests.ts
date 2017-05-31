import { mockResponsibility, mockScenarioTouchstoneAndCoverageSets, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { Store } from "../../main/stores/ResponsibilityStore";
import { alt } from "../../main/alt";

describe("ResponsibilityStore.fetchOneTimeCoverageToken", () => {
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, { id: "scenario-id"});
    new FetchHelper<string>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage/get_onetime_link/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroupId: "group-id",
                    currentResponsibility: responsibility
                }
            }));
            return Store.fetchOneTimeCoverageToken();
        },
        makePayload: () => "TOKEN"
    }).addTestsToMocha();
});