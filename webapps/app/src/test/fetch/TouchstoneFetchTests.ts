import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { responsibilityStore } from "../../main/contrib/stores/ResponsibilityStore";
import { Touchstone } from "../../main/contrib/models/Generated";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper<Touchstone[]>({
        expectedURL: "/touchstones/",
        triggerFetch: () => responsibilityStore.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});