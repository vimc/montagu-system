import { mockTouchstone } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";

import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { Touchstone } from "../../../main/shared/models/Generated";
import { doNothing } from "../../../main/shared/Helpers";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";

describe("ResponsibilityStore.fetchTouchstones", () => {
    new FetchHelper<Touchstone[]>({
        expectedURL: "/touchstones/",
        triggerFetch: () => responsibilityStore.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ],
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => touchstoneActions.update([ mockTouchstone() ])
    }).addTestsToMocha();
});