import * as React from "react";
import {expect} from "chai";
import {responsibilityStore} from "../../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockTouchstone} from "../../../../mocks/mockModels";
import {checkAsync} from "../../../../testHelpers";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {jwtDecoder} from "../../../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../../../mocks/mockRemote";
import {helpers} from "../../../../../main/shared/Helpers";
import {Notification} from "../../../../../main/shared/actions/NotificationActions";
import {bootstrapStore} from "../../../../StoreHelpers";
import {mainStore} from "../../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../../main/contrib/stores/Loadable";
import { mockTouchstonesEndpoint} from "../../../../mocks/mockEndpoints";
import {mockLocation, setupMainStore} from "../../../../mocks/mocks";
import {expectOrderedActions} from "../../../../actionHelpers";
import {Sandbox} from "../../../../Sandbox";
import {UploadModelRunParametersPage} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/UploadModelRunParametersPage";
import {DownloadDataTitle} from "../../../../../main/contrib/components/Responsibilities/DownloadDataTitle";

describe('UploadModelRunParameterPage', () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const location = mockLocation({
        touchstoneId: "touchstone-1",
        groupId: "group-1",
    });

    it("triggers actions when it loads", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const fetchOneTimeParametersToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeParametersToken").returns(Promise.resolve(true));

        const group = mockModellingGroup({id: "group-1"});
        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(mockResult("OK"))});
        sandbox.sinon.stub(helpers, "queryStringAsObject").returns({result: "blahblahblah"});

        setupMainStore({groups: [group]});

        new UploadModelRunParametersPage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            afterWait(done, () => {

                const successNotification: Notification = {
                    message: "Success! You have uploaded a new set of model run parameters.",
                    type: "info"
                };
                expectOrderedActions(spy, [
                    {action: "ModelParameterActions.clearUsedToken", payload: true},
                    {action: "ModellingGroupActions.setCurrentGroup", payload: "group-1"},
                    {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1"}
                ], 0);
                expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                expect(fetchOneTimeParametersToken.called).to.be.equal(true, "fetchOneTimeParametersToken");
            });
        });
    });

    it("has correct meta data", () => {

        const page = new UploadModelRunParametersPage({location: location, router: null});
        expect(page.name()).to.eql("Upload model run parameters");
        expect(page.urlFragment()).to.eql("model-run-parameters");
        expect(page.title().props).to.have.property("title", "Upload model run parameters");

    });

    const page = new UploadModelRunParametersPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})])
        ]);
    });
});