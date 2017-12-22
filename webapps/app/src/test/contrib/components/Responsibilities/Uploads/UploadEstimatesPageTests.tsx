import * as React from "react";
import {expect} from "chai";
import {responsibilityStore} from "../../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockTouchstone} from "../../../../mocks/mockModels";
import {checkAsync} from "../../../../testHelpers";
import {UploadBurdenEstimatesPage} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {jwtDecoder} from "../../../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../../../mocks/mockRemote";
import {helpers} from "../../../../../main/shared/Helpers";
import {Notification} from "../../../../../main/shared/actions/NotificationActions";
import {bootstrapStore} from "../../../../StoreHelpers";
import {mainStore} from "../../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../../main/contrib/stores/Loadable";
import {mockResponsibilitiesEndpoint, mockTouchstonesEndpoint} from "../../../../mocks/mockEndpoints";
import {mockLocation, setupStores} from "../../../../mocks/mocks";
import {expectOrderedActions} from "../../../../actionHelpers";
import {Sandbox} from "../../../../Sandbox";

describe('UploadEstimatesPage', () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const location = mockLocation({
        touchstoneId: "touchstone-1",
        scenarioId: "scenario-1",
        groupId: "group-1",
    });

    it("triggers actions when it loads", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const fetchOneTimeEstimatesToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeEstimatesToken").returns(Promise.resolve(true));

        const group = mockModellingGroup({id: "group-1"});
        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(mockResult("OK"))});
        sandbox.sinon.stub(helpers, "queryStringAsObject").returns({result: "blahblahblah"});

        const touchstone = mockTouchstone({id: "touchstone-1"});

        setupStores({groups: [group], touchstones: [touchstone]});

        new UploadBurdenEstimatesPage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            afterWait(done, () => {

                const successNotification: Notification = {
                    message: "Success! You have uploaded a new set of burden estimates.",
                    type: "info"
                };
                expectOrderedActions(spy, [
                    {action: "EstimateTokenActions.clearUsedToken", payload: true},
                    {action: "ModellingGroupActions.setCurrentGroup", payload: "group-1"},
                    {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1"},
                    {action: "ResponsibilityActions.setCurrentResponsibility", payload: "scenario-1"}
                ], 0);
                expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                expect(fetchOneTimeEstimatesToken.called).to.be.equal(true, "fetchOneTimeEstimatesToken");
            });
        });
    });

    const page = new UploadBurdenEstimatesPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})],"group-1"),
            mockResponsibilitiesEndpoint(["scenario-1"]),
        ]);
    });
});