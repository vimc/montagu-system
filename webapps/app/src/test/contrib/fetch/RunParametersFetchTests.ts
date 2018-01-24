import {FetchHelper} from "../../shared/fetch/helpers";
import {runParametersStore} from "../../../main/contrib/stores/RunParametersStore";
import {fetchToken} from "../../../main/contrib/sources/RunParametersSource";
import {mockModelRunParameterSet} from "../../mocks/mockModels";
import {bootstrapStore} from "../../StoreHelpers";
import { Sandbox } from "../../Sandbox";
import { expect } from "chai";

describe("RunParametersStore.fetchOneTimeParametersToken", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('generates right url when tries to fetch token', (done: DoneCallback) => {
        const fetchSpy = sandbox.fetcherSpy();

        fetchToken("group-1", "touchstone-1", 1).then(() => {
            expect(fetchSpy.getCall(0).args[0])
                .to.equal('/modelling-groups/group-1/model-run-parameters/touchstone-1/1/get_onetime_link/');
            done();
        })
    });
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