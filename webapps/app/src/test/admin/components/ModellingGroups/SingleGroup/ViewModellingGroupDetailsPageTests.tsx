import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { groupStore } from "../../../../../main/admin/stores/GroupStore";
import { mockLocation } from "../../../../mocks/mocks";
import * as React from "react";
import {
    PageProps,
    ViewModellingGroupDetailsPage
} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import { expectOneAction } from "../../../../actionHelpers";
import { checkAsync } from "../../../../testHelpers";

describe("ViewModelingGroupDetailsPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchGroups = sandbox.sinon.stub(groupStore, "fetchGroups").returns(Promise.resolve([]));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails");
        const dispatchSpy = sandbox.dispatchSpy();

        const location = mockLocation<PageProps>({ groupId: "gId" });
        sandbox.mount(<ViewModellingGroupDetailsPage location={ location }/>);

        checkAsync(done, () => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
            expectOneAction(dispatchSpy, { action: "ModellingGroupActions.setCurrentGroup", payload: "gId" });
            expect(fetchGroupDetails.called).to.equal(true, "Expected groupStore.fetchGroupDetails to be triggered");
        });
    });
});
