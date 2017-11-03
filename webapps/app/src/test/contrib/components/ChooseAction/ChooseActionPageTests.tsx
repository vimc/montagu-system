import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../Sandbox";
import { ChooseActionPage, LocationProps } from "../../../../main/contrib/components/ChooseAction/ChooseActionPage";
import { mockLocation } from "../../../mocks/mocks";
import { expectOneAction } from "../../../actionHelpers";
import { checkAsync } from "../../../testHelpers";
import { responsibilityStore } from "../../../../main/contrib/stores/ResponsibilityStore";
import { groupStore } from "../../../../main/admin/stores/GroupStore";

describe("ChooseActionPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers setModellingGroup on load", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon
            .stub(responsibilityStore, "fetchTouchstones")
            .returns(Promise.resolve(null));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails").returns(Promise.resolve({}));
        const location = mockLocation<LocationProps>({ groupId: "gId" });
        sandbox.mount(<ChooseActionPage location={location} router={null} />);
        checkAsync(done, (afterWait) => {
            expect(fetchTouchstones.called).to.equal(true, "Expected responsibilityStore.fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {
                    action: "ModellingGroupActions.setCurrentGroup",
                    payload: "gId"
                });
            });
        });
    });
});