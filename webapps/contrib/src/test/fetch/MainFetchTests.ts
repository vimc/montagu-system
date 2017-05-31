import { mockDisease } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { Store } from "../../main/stores/MainStore";
import { Disease } from "../../main/models/Generated";

describe("MainStore.load", () => {
    new FetchHelper<Disease[]>({
        triggerFetch: () => Store.load(),
        makePayload: () => [ mockDisease(), mockDisease() ],
        expectedURL: "/diseases/"
    }).addTestsToMocha();
});