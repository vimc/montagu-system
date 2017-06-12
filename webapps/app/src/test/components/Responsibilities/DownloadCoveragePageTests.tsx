import * as React from "react";
import { Sandbox } from "../../Sandbox";
import { expect } from "chai";
import { expectOrderedActions } from "../../actionHelpers";
import { mockLocation, setupMainStore } from "../../mocks/mocks";

import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { DownloadCoveragePage } from "../../../main/contrib/components/Responsibilities/Coverage/DownloadCoveragePage";
import { mockModellingGroup } from "../../mocks/mockModels";

describe('DownloadCoveragePage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
       sandbox.restore();
    });

    it("triggers actions when it mounts", () => {
        const spy = sandbox.dispatchSpy();
        const fetchCoverageSets = sandbox.sinon.stub(responsibilityStore, "fetchCoverageSets");
        const fetchOneTimeCoverageToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeCoverageToken");
        const location = mockLocation({
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            groupId: "group-1",
        });
        const group = mockModellingGroup({ id: "group-1" });
        setupMainStore({ groups: [group] });

        sandbox.mount(<DownloadCoveragePage location={ location } />);

        expectOrderedActions(spy, [
            { action: "ModellingGroupActions.setCurrentModellingGroup", payload: "group-1" },
            { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" },
            { action: "ResponsibilityActions.setCurrentResponsibility", payload: "scenario-1" },
        ], 0);
        expect(fetchCoverageSets.called).to.be.true;
        expect(fetchOneTimeCoverageToken.called).to.be.true;
    });
});