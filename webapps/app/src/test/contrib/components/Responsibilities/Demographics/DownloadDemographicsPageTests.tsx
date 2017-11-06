import * as React from "react";
import {Sandbox} from "../../../../Sandbox";
import {expect} from "chai";
import {checkAsync} from "../../../../testHelpers";
import {expectOneAction} from "../../../../actionHelpers";
import {DownloadDemographicsPage} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsPage";
import {mockLocation, setupMainStore} from "../../../../mocks/mocks";
import {mockDemographicDataset, mockModellingGroup, mockTouchstone} from "../../../../mocks/mockModels";
import {responsibilityStore} from "../../../../../main/contrib/stores/ResponsibilityStore";
import {demographicStore} from "../../../../../main/contrib/stores/DemographicStore";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {bootstrapStore} from "../../../../StoreHelpers";
import {mainStore} from "../../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../../main/contrib/stores/Loadable";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {successResult} from "../../../../mocks/mockRemote";

describe("DownloadDemographicsPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const location = mockLocation({
        groupId: "group-1",
        touchstoneId: "touchstone-1",
    });

    it("triggers actions on load", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchDataSets = sandbox.sinon.stub(demographicStore, "fetchDataSets").returns(Promise.resolve(true));

        const group = mockModellingGroup({id: "group-1"});
        setupMainStore({groups: [group]});

        new DownloadDemographicsPage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, {action: "ModellingGroupActions.setCurrentGroup", payload: "group-1"}, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1"}, 1);
                expect(fetchDataSets.called).to.equal(true, "Expected fetchDataSets to be called");
            });
        });
    });

    const page = new DownloadDemographicsPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            {
                urlFragment: new RegExp("/touchstones/"),
                result: successResult([mockTouchstone({ id: "touchstone-1" })])
            },
            {
                urlFragment: new RegExp("/touchstones/touchstone-1/demographics/"),
                result: successResult([mockDemographicDataset()])
            }
        ])
    });
});