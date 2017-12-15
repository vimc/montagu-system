import {FetchHelper} from "../../shared/fetch/helpers";
import {runParametersStore} from "../../../main/contrib/stores/RunParametersStore";
import {mockModelRunParameterSet} from "../../mocks/mockModels";
import {bootstrapStore} from "../../StoreHelpers";

describe("RunParametersStore.fetchOneTimeParametersToken", () => {
    new FetchHelper({
        expectedURL: "/modelling-groups/group-1/model-run-parameters/touchstone-1/get_onetime_link/?redirectUrl=http://localhost:5000/redirect/to",
        prepareForFetch: () => {
            bootstrapStore(runParametersStore, {
                groupId: "group-1",
                touchstoneId: "touchstone-1"
            });
        },
        triggerFetch: () => runParametersStore.fetchOneTimeParametersToken("/redirect/to"),
        makePayload: () => "TOKEN",
        expectedSuccessResult: {
            action: "receiveToken",
            payload: "TOKEN"
        }
    }).addTestsToMocha();
});

describe("RunParametersStore.fetchParameterSets", () => {
    new FetchHelper({
        expectedURL: "/modelling-groups/group-1/model-run-parameters/touchstone-1/",
        triggerFetch: () => runParametersStore.fetchParameterSets(),
        makePayload: () => [mockModelRunParameterSet()],
        prepareForFetch: () => {
            bootstrapStore(runParametersStore, {
                groupId: "group-1",
                touchstoneId: "touchstone-1"
            });
        },
        prepareForCachedFetch: () => {
            bootstrapStore(runParametersStore, {
                parameterSets: [mockModelRunParameterSet()]
            });
        }
    }).addTestsToMocha();
});