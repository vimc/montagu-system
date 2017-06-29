import {
    mockModellingGroup,
    mockResponsibility,
    mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../../main/shared/alt";
import { ScenarioTouchstoneAndCoverageSets } from "../../../main/shared/models/Generated";

describe("ResponsibilityStore.fetchCoverageSets", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, { id: "scenario-id"});
    new FetchHelper<ScenarioTouchstoneAndCoverageSets>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage_sets/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility
                }
            }));
            return responsibilityStore.fetchCoverageSets();
        },
        makePayload: () => mockScenarioTouchstoneAndCoverageSets()
    }).addTestsToMocha();
});