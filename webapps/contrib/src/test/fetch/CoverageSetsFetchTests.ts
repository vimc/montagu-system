import { mockResponsibility, mockScenarioTouchstoneAndCoverageSets, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { Store } from "../../main/stores/ResponsibilityStore";
import { alt } from "../../main/alt";

describe("ResponsibilityStore.fetchCoverageSets", () => {
    new FetchHelper({
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: mockTouchstone(),
                    currentModellingGroupId: "group-id",
                    currentResponsibility: mockResponsibility()
                }
            }));
            return Store.fetchCoverageSets();
        },
        makePayload: () => mockScenarioTouchstoneAndCoverageSets()
    }).addTestsToMocha();
});