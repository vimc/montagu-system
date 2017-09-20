import * as React from "react";
import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { expectOneAction, expectOrderedActions } from "../../../../actionHelpers";
import { mockLocation, setupMainStore } from "../../../../mocks/mocks";

import { responsibilityStore } from "../../../../../main/contrib/stores/ResponsibilityStore";
import { mockModellingGroup } from "../../../../mocks/mockModels";
import { DownloadCoveragePage } from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoveragePage";
import { checkAsync } from "../../../../testHelpers";
import { UploadBurdenEstimatesPage } from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";

describe('UploadEstimatesPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("triggers actions when it mounts", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const fetchOneTimeEstimatesToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeEstimatesToken").returns(Promise.resolve(true));;
        const location = mockLocation({
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            groupId: "group-1",
        });
        const group = mockModellingGroup({ id: "group-1" });
        setupMainStore({ groups: [group] });

        sandbox.mount(<UploadBurdenEstimatesPage location={ location }/>);

        checkAsync(done, (afterWait) => {
            expectOrderedActions(spy, [{ action: "EstimateTokenActions.clearUsedToken", payload: true },
            { action: "ModellingGroupActions.setCurrentGroup", payload: "group-1" }], 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" }, 1);
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
                afterWait(done, () => {
                    expectOneAction(spy, { action: "ResponsibilityActions.setCurrentResponsibility", payload: "scenario-1" }, 2);
                    expect(fetchOneTimeEstimatesToken.called).to.be.equal(true, "fetchOneTimeEstimatesToken");
                });
            });
        });
    });
})
;