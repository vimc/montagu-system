import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../../Sandbox";
import { userStore } from "../../../../../main/admin/stores/UserStore";
import { groupStore } from "../../../../../main/admin/stores/GroupStore";
import { mockLocation } from "../../../../mocks/mocks";
import { GroupAdminPage } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminPage";
import { PageProps } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import { checkAsync } from "../../../../testHelpers";
import { expectOneAction } from "../../../../actionHelpers";
import { alt } from "../../../../../main/shared/alt";

describe("GroupAdminPage", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers").returns(Promise.resolve(true));
        const fetchGroups = sandbox.sinon.stub(groupStore, "fetchGroups").returns(Promise.resolve([]));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails");
        const dispatchSpy = sandbox.dispatchSpy();

        const location = mockLocation<PageProps>({ groupId: "gId" });
        sandbox.mount(<GroupAdminPage location={ location }/>);

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