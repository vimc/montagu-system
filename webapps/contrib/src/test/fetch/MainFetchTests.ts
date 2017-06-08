import { mockDisease } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { mainStore } from "../../main/stores/MainStore";
import { Disease } from "../../main/models/Generated";

describe("MainStore.fetchDiseases", () => {
    new FetchHelper<Disease[]>({
        triggerFetch: () => mainStore.fetchDiseases(),
        makePayload: () => [ mockDisease(), mockDisease() ],
        expectedURL: "/diseases/"
    }).addTestsToMocha();
});