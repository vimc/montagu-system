import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { responsibilityStore } from "../../main/stores/ResponsibilityStore";
import { Touchstone } from "../../main/models/Generated";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper<Touchstone[]>({
        expectedURL: "/touchstones/",
        triggerFetch: () => responsibilityStore.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});