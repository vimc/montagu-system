import { mockModellingGroup, mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { responsibilityStore } from "../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../main/alt";

describe("ResponsibilityStore.fetchResponsibilities", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    new FetchHelper({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group
                }
            }));
            return responsibilityStore.fetchResponsibilities();
        },
        makePayload: () => mockResponsibilitySet({ touchstone: touchstone.id })
    }).addTestsToMocha();
});