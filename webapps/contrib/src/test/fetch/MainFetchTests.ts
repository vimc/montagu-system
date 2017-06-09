import { mockDisease, mockModellingGroup } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";

import { mainStore } from "../../main/stores/MainStore";
import { Disease, ModellingGroup } from "../../main/models/Generated";

describe("MainStore.fetchDiseases", () => {
    new FetchHelper<Disease[]>({
        triggerFetch: () => mainStore.fetchDiseases(),
        makePayload: () => [ mockDisease(), mockDisease() ],
        expectedURL: "/diseases/"
    }).addTestsToMocha();
});

describe("MainStore.fetchModellingGroups", () => {
    new FetchHelper<ModellingGroup[]>({
        triggerFetch: () => mainStore.fetchModellingGroups(),
        makePayload: () => [ mockModellingGroup(), mockModellingGroup() ],
        expectedURL: "/modelling-groups/"
    }).addTestsToMocha();
});