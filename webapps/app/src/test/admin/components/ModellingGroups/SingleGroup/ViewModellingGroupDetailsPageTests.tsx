import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { groupStore } from "../../../../../main/admin/stores/GroupStore";
import { mockLocation } from "../../../../mocks/mocks";
import * as React from "react";
import {
    ModellingGroupDetailsPageProps,
    ViewModellingGroupDetailsPage
} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import { expectOneAction } from "../../../../actionHelpers";
import { checkAsync } from "../../../../testHelpers";
import { userStore } from "../../../../../main/admin/stores/UserStore";

describe("ViewModelingGroupDetailsPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers").returns(Promise.resolve(true));
        const fetchGroups = sandbox.sinon.stub(groupStore, "fetchGroups").returns(Promise.resolve([]));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails");
        const dispatchSpy = sandbox.dispatchSpy();

        const location = mockLocation<ModellingGroupDetailsPageProps>({ groupId: "gId" });
        sandbox.mount(<ViewModellingGroupDetailsPage location={ location }/>);

        checkAsync(done, (afterWait) => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(done, () => {
                expectOneAction(dispatchSpy, { action: "ModellingGroupActions.setCurrentGroup", payload: "gId" });
                expect(fetchGroupDetails.called).to.equal(true, "Expected groupStore.fetchGroupDetails to be triggered");
            });
        });
    });
});
