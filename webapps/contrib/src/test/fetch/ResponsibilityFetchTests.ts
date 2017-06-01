import { mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { responsibilityStore } from "../../main/stores/ResponsibilityStore";
import { alt } from "../../main/alt";

describe("ResponsibilityStore.fetchResponsibilities", () => {
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    new FetchHelper({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroupId: "group-id"
                }
            }));
            return responsibilityStore.fetchResponsibilities();
        },
        makePayload: () => mockResponsibilitySet({ touchstone: touchstone.id })
    }).addTestsToMocha();
});