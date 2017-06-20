import { mockModellingGroup, mockModellingGroupDetails } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { ModellingGroup, ModellingGroupDetails } from "../../../main/shared/models/Generated";
import { groupStore } from "../../../main/admin/stores/GroupStore";
import { alt } from "../../../main/shared/alt";

describe("GroupStore.fetch", () => {
    new FetchHelper<ModellingGroup[]>({
        expectedURL: "/modelling-groups/",
        triggerFetch: () => groupStore.fetchGroups(),
        makePayload: () => [ mockModellingGroup() ]
    }).addTestsToMocha();

    new FetchHelper<ModellingGroupDetails>({
        expectedURL: "/modelling-groups/gId/",
        triggerFetch: () => {
            alt.bootstrap(JSON.stringify({
                GroupStore: {
                    groupDetails: {},
                    currentGroupId: "gId"
                }
            }));
            return groupStore.fetchGroupDetails();
        },
        makePayload: () => mockModellingGroupDetails()
    }).addTestsToMocha();
});