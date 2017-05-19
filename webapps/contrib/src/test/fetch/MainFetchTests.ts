import { mockDisease } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { Store } from "../../main/stores/MainStore";

describe("MainStore.load", () => {
    new FetchHelper({
        triggerFetch: () => Store.load(),
        makePayload: () => [ mockDisease(), mockDisease() ]
    }).addTestsToMocha();
});