import * as React from "react";
import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { checkAsync } from "../../../../testHelpers";
import { expectOneAction } from "../../../../actionHelpers";
import { DownloadDemographicsPage } from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsPage";
import { mockLocation, setupMainStore } from "../../../../mocks/mocks";
import { mockModellingGroup } from "../../../../mocks/mockModels";
import { responsibilityStore } from "../../../../../main/contrib/stores/ResponsibilityStore";
import { demographicStore } from "../../../../../main/contrib/stores/DemographicStore";

describe("DownloadDemographicsPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("triggers actions on mount", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchDataSets = sandbox.sinon.stub(demographicStore, "fetchDataSets").returns(Promise.resolve(true));
        const location = mockLocation({
            groupId: "group-1",
            touchstoneId: "touchstone-1",
        });
        const group = mockModellingGroup({ id: "group-1" });
        setupMainStore({ groups: [group] });

        new DownloadDemographicsPage({location: location}).load();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, { action: "ModellingGroupActions.setCurrentGroup", payload: "group-1" }, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" }, 1);
                expect(fetchDataSets.called).to.equal(true, "Expected fetchDataSets to be called");
            });
        });
    });
});