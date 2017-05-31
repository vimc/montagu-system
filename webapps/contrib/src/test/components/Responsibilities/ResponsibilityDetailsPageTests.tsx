import * as React from "react";
import { Sandbox } from "../../Sandbox";
import { expect } from "chai";
import { dispatchSpy, expectOrderedActions } from "../../actionHelpers";
import { mockLocation } from "../../mocks/mocks";

import * as ResponsibilityStore from "../../../main/stores/ResponsibilityStore";
import { ResponsibilityDetailsPage } from "../../../main/components/Responsibilities/Details/ResponsibilityDetailsPage";

describe('ResponsibilityDetailsPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
       sandbox.restore();
    });

    it("triggers actions when it mounts", () => {
        const spy = dispatchSpy(sandbox);
        const fetchCoverageSets = sandbox.sinon.stub(ResponsibilityStore.Store, "fetchCoverageSets");
        const fetchOneTimeCoverageToken = sandbox.sinon.stub(ResponsibilityStore.Store, "fetchOneTimeCoverageToken");
        const location = mockLocation({
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1"
        });

        sandbox.mount(<ResponsibilityDetailsPage location={ location } />);

        expectOrderedActions(spy, [
            { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" },
            { action: "ResponsibilityActions.setCurrentResponsibility", payload: "scenario-1" },
        ], 0);
        expect(fetchCoverageSets.called).to.be.true;
        expect(fetchOneTimeCoverageToken.called).to.be.true;
    });
});