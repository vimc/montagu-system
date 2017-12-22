import {mockModellingGroup, mockTouchstone} from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";

import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { Touchstone } from "../../../main/shared/models/Generated";
import { doNothing } from "../../../main/shared/Helpers";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import {alt} from "../../../main/shared/alt";

describe("ResponsibilityStore.fetchTouchstones", () => {
    const group = mockModellingGroup({ id: "group-id" });
    new FetchHelper<Touchstone[], Touchstone[]>({
        expectedURL: "/modelling-groups/group-id/responsibilities/",
        triggerFetch: () => responsibilityStore.fetchTouchstones(),
        makePayload: () => [ mockTouchstone(), mockTouchstone() ],
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentModellingGroup: group
                }
            }));
        },
        prepareForCachedFetch: () => touchstoneActions.update([ mockTouchstone() ])
    }).addTestsToMocha();
});