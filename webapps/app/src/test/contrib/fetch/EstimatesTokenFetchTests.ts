import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../../main/shared/alt";

describe("ResponsibilityStore.fetchOneTimeEstimatesToken", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const responsibility = mockResponsibility({}, mockScenario({ id: "scenario-id"}));
    new FetchHelper<string, string>({expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/estimates/get_onetime_link/?redirectUrl=http://localhost:5000/redirect/to",
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility,
                    redirectPath: null
                }
            }));
        },
        triggerFetch: () => responsibilityStore.fetchOneTimeEstimatesToken("/redirect/to"),
        makePayload: () => "TOKEN"
    }).addTestsToMocha();
});