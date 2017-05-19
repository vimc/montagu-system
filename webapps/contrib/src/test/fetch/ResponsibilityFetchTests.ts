import { mockResponsibilitySet, mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import { Store } from "../../main/stores/ResponsibilityStore";
import { alt } from "../../main/alt";

describe("ResponsibilityStore.fetchResponsibilities", () => {
    const touchstone = mockTouchstone();
    new FetchHelper({
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroupId: "group-id"
                }
            }));
            return Store.fetchResponsibilities();
        },
        makePayload: () => mockResponsibilitySet({ touchstone: touchstone.id })
    }).addTestsToMocha();
});