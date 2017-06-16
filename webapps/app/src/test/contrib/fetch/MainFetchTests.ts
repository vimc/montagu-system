import { mockDisease, mockModellingGroup } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";

import { mainStore } from "../../../main/contrib/stores/MainStore";
import { Disease, ModellingGroup } from "../../../main/shared/models/Generated";

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