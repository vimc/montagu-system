import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import * as actionHelpers from "../actionHelpers";

import { Store } from "../../main/stores/TouchstoneStore";

describe("TouchstoneStore.fetchTouchstones", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    new FetchHelper({
        triggerFetch: () => Store.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ]
    }).addTestsToMocha();
});