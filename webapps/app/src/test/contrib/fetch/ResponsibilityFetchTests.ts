import {
    mockExtendedResponsibilitySet, mockModellingGroup, mockResponsibilitySet,
    mockTouchstone
} from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../../main/shared/alt";
import { doNothing } from "../../../main/shared/Helpers";

describe("ResponsibilityStore.fetchResponsibilities", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    new FetchHelper({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/",
        triggerFetch: () => responsibilityStore.fetchResponsibilities(),
        makePayload: () => mockResponsibilitySet({ touchstone: touchstone.id }),
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group
                }
            }));
        },
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    responsibilitySets: [ mockExtendedResponsibilitySet(null, null, touchstone, group) ]
                }
            }));
        }
    }).addTestsToMocha();
});