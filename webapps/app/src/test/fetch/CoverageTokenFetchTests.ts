import {
    mockModellingGroup, mockResponsibility, mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { responsibilityStore } from "../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../main/shared/alt";

describe("ResponsibilityStore.fetchOneTimeCoverageToken", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, { id: "scenario-id"});
    new FetchHelper<string>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage/get_onetime_link/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility
                }
            }));
            return responsibilityStore.fetchOneTimeCoverageToken();
        },
        makePayload: () => "TOKEN"
    }).addTestsToMocha();
});