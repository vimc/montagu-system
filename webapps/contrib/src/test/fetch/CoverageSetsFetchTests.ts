import { mockResponsibility, mockScenarioTouchstoneAndCoverageSets, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { responsibilityStore } from "../../main/stores/ResponsibilityStore";
import { alt } from "../../main/alt";
import { ScenarioTouchstoneAndCoverageSets } from "../../main/models/Generated";

describe("ResponsibilityStore.fetchCoverageSets", () => {
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, { id: "scenario-id"});
    new FetchHelper<ScenarioTouchstoneAndCoverageSets>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage_sets/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroupId: "group-id",
                    currentResponsibility: responsibility
                }
            }));
            return responsibilityStore.fetchCoverageSets();
        },
        makePayload: () => mockScenarioTouchstoneAndCoverageSets()
    }).addTestsToMocha();
});