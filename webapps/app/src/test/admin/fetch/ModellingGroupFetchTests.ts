import { mockModellingGroup } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { ModellingGroup } from "../../../main/shared/models/Generated";
import { groupStore } from "../../../main/admin/stores/GroupStore";

describe("GroupStore.fetch", () => {
    new FetchHelper<ModellingGroup[]>({
        expectedURL: "/modelling-groups/",
        triggerFetch: () => groupStore.fetch(),
        makePayload: () => [ mockModellingGroup() ]
    }).addTestsToMocha();
});