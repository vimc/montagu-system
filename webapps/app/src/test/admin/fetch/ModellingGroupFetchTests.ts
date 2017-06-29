import { mockModellingGroup, mockModellingGroupDetails } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { ModellingGroup, ModellingGroupDetails } from "../../../main/shared/models/Generated";
import { groupStore } from "../../../main/admin/stores/GroupStore";
import { alt } from "../../../main/shared/alt";
import { doNothing } from "../../../main/shared/Helpers";

describe("GroupStore.fetch", () => {
    new FetchHelper<ModellingGroup[]>({
        expectedURL: "/modelling-groups/",
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                GroupStore: {
                    groups: [ mockModellingGroup() ]
                }
            }))
        },
        triggerFetch: () => groupStore.fetchGroups(),
        makePayload: () => [ mockModellingGroup() ]
    }).addTestsToMocha();

    new FetchHelper<ModellingGroupDetails>({
        expectedURL: "/modelling-groups/gId/",
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                GroupStore: {
                    currentGroupId: "gId",
                    groupDetails: {}
                }
            }));
        },
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                GroupStore: {
                    currentGroupId: "gId",
                    groupDetails: {
                        "gId": mockModellingGroupDetails()
                    }
                }
            }))
        },
        triggerFetch: () => groupStore.fetchGroupDetails(),
        makePayload: () => mockModellingGroupDetails()
    }).addTestsToMocha();
});