import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {expect} from "chai";
import {expectOneAction} from "../../../actionHelpers";
import {mockLocation, setupStore} from "../../../mocks/mocks";

import {responsibilityStore} from "../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import {DownloadCoveragePage} from "../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoveragePage";
import {checkAsync} from "../../../testHelpers";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {bootstrapStore} from "../../../StoreHelpers";
import {mainStore} from "../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../main/contrib/stores/Loadable";
import {mockFetcherForMultipleResponses} from "../../../mocks/mockMultipleEndpoints";
import {mockResponsibilitiesEndpoint, mockTouchstonesEndpoint} from "../../../mocks/mockEndpoints";

describe('DownloadCoveragePage', () => {
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
        const fetchCoverageSets = sandbox.sinon.stub(responsibilityStore, "fetchCoverageSets").returns(Promise.resolve(true));
        const fetchOneTimeCoverageToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeCoverageToken").returns(Promise.resolve(true));

        const group = mockModellingGroup({id: "group-1"});
        const touchstone = mockTouchstone({id: "touchstone-1"});
        setupStore({groups: [group], touchstones: [touchstone]});

        new DownloadCoveragePage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, {action: "ModellingGroupActions.setCurrentGroup", payload: "group-1"}, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1"}, 1);
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                afterWait(done, () => {
                    expectOneAction(spy, {
                        action: "ResponsibilityActions.setCurrentResponsibility",
                        payload: "scenario-1"
                    }, 2);
                    expect(fetchCoverageSets.called).to.be.equal(true, "Expected fetchCoverageSets to be called");
                    expect(fetchOneTimeCoverageToken.called).to.equal(true, "Expected fetchOneTimeCoverageToken to be called");
                });
            });
        });
    });

    const page = new DownloadCoveragePage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})]),
            mockResponsibilitiesEndpoint(["scenario-1"])
        ]);
    });
});