import { mockDisease, mockModellingGroup } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";

import { mainStore } from "../../../main/contrib/stores/MainStore";
import { Disease, ModellingGroup } from "../../../main/shared/models/Generated";
import { doNothing } from "../../../main/shared/Helpers";
import { diseaseActions } from "../../../main/contrib/actions/DiseaseActions";
import { modellingGroupActions } from "../../../main/shared/actions/ModellingGroupActions";

describe("MainStore.fetchDiseases", () => {
    new FetchHelper<Disease[]>({
        triggerFetch: () => mainStore.fetchDiseases(),
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => diseaseActions.update([ mockDisease() ]),
        makePayload: () => [ mockDisease(), mockDisease() ],
        expectedURL: "/diseases/"
    }).addTestsToMocha();
});

describe("MainStore.fetchModellingGroups", () => {
    new FetchHelper<ModellingGroup[]>({
        triggerFetch: () => mainStore.fetchModellingGroups(),
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => modellingGroupActions.updateGroups([ mockModellingGroup() ]),
        makePayload: () => [ mockModellingGroup(), mockModellingGroup() ],
        expectedURL: "/modelling-groups/"
    }).addTestsToMocha();
});