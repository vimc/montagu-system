import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { Store } from "../../main/stores/ResponsibilityStore";
import { Touchstone } from "../../main/models/Generated";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper<Touchstone[]>({
        expectedURL: "/touchstones/",
        triggerFetch: () => Store.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});