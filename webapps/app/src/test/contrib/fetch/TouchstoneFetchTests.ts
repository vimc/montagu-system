import { mockTouchstone } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";

import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { Touchstone } from "../../../main/shared/models/Generated";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper<Touchstone[]>({
        expectedURL: "/touchstones/",
        triggerFetch: () => responsibilityStore.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});