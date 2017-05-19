import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { Store } from "../../main/stores/ResponsibilityStore";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper({
        triggerFetch: () => Store.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});