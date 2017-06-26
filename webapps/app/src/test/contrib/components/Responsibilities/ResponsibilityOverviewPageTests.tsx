import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockLocation, setupMainStore } from "../../../mocks/mocks";
import { expectOneAction } from "../../../actionHelpers";

import { responsibilityStore } from "../../../../main/contrib/stores/ResponsibilityStore";
import { mockModellingGroup, mockTouchstone } from "../../../mocks/mockModels";
import { ResponsibilityOverviewPage } from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import { ResponsibilityOverviewTitleComponent } from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewTitle";
import { checkAsync } from "../../../testHelpers";

describe('ResponsibilityOverviewPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("triggers actions when it mounts", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const location = mockLocation({
            touchstoneId: "touchstone-id",
            groupId: "group-id"
        });
        const group = mockModellingGroup({ id: "group-id" });
        setupMainStore({ groups: [group] });

        sandbox.mount(<ResponsibilityOverviewPage location={ location }/>);

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, { action: "ModellingGroupActions.setCurrentModellingGroup", payload: "group-id" }, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(() => {
                expectOneAction(spy, { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-id" }, 1);
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
            });
        });
    });
});

describe("ResponsibilityOverviewTitleComponent", () => {
    it("renders title based on touchstoneId", () => {
        const touchstone = mockTouchstone({ description: "Fizzy pop" });
        const rendered = shallow(<ResponsibilityOverviewTitleComponent touchstone={ touchstone } />);
        const titleText = rendered.text();
        expect(titleText).to.contain("Responsibilities in Fizzy pop");
    });
});