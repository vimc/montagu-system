import * as React from "react";
import {expect} from "chai";
import {responsibilityStore} from "../../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockModelRunParameterSet, mockScenario, mockTouchstone} from "../../../../mocks/mockModels";
import {checkAsync, checkPromise} from "../../../../testHelpers";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {jwtDecoder} from "../../../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../../../mocks/mockRemote";
import {helpers} from "../../../../../main/shared/Helpers";
import {bootstrapStore} from "../../../../StoreHelpers";
import {mainStore} from "../../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../../main/contrib/stores/Loadable";
import {
    mockModelRunParametersEndpoint, mockResponsibilitiesEndpoint,
    mockTouchstonesEndpoint
} from "../../../../mocks/mockEndpoints";
import {mockLocation, mockMatch, setupStores} from "../../../../mocks/mocks";
import {expectOrderedActions} from "../../../../actionHelpers";
import {Sandbox} from "../../../../Sandbox";
import {ModelRunParametersPage} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {runParametersStore} from "../../../../../main/contrib/stores/RunParametersStore";

describe('ModelRunParameterPage', () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const match = mockMatch({
        touchstoneId: "touchstone-1",
        groupId: "group-1",
    });
    const location = mockLocation();

    it("triggers actions when it loads", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const fetchParameterSets = sandbox.sinon.stub(runParametersStore, "fetchParameterSets").returns(Promise.resolve(true));

        const group = mockModellingGroup({id: "group-1"});
        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(mockResult("OK"))});
        sandbox.sinon.stub(helpers, "queryStringAsObject").returns({result: "blahblahblah"});

        const touchstone = mockTouchstone({id: "touchstone-1"});
        setupStores({groups: [group], touchstones: [touchstone]});

        const promise = new ModelRunParametersPage().load({
            touchstoneId: "touchstone-1",
            groupId: "group-1",
        });
        checkPromise(done, promise, (_, afterWait) => {
            afterWait(done, () => {
                expectOrderedActions(spy, [
                    {action: "ModellingGroupActions.setCurrentGroup", payload: "group-1"},
                    {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1"}
                ], 0);
                expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                expect(fetchParameterSets.called).to.be.equal(true, "fetchOneTimeParametersToken");
            });
        });
    });

    it("has correct meta data", () => {
        const page = new ModelRunParametersPage({location, match, router: null});
        expect(page.name()).to.eql("Upload parameters");
        expect(page.urlFragment()).to.eql("parameters");
        expect(page.title().props).to.have.property("title", "Upload parameters");

    });

    const page = new ModelRunParametersPage({location, match, router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})], "group-1"),
            mockResponsibilitiesEndpoint(["scenario-1"]),
            mockModelRunParametersEndpoint([mockModelRunParameterSet()])
        ]);
    });
});