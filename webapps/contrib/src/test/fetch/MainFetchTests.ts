import { mockDisease } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import * as actionHelpers from "../actionHelpers";

import { Store } from "../../main/stores/MainStore";

describe("MainStore.load", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    new FetchHelper({
        triggerFetch: () => Store.load(),
        makePayload: () => [ mockDisease(), mockDisease() ]
    }).addTestsToMocha();
});