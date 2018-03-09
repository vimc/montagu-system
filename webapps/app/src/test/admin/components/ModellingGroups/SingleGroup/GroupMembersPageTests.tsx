import * as React from "react";
import {expect} from "chai";

import {Sandbox} from "../../../../Sandbox";
import {userStore} from "../../../../../main/admin/stores/UserStore";
import {groupStore} from "../../../../../main/admin/stores/GroupStore";
import {mockLocation, mockMatch} from "../../../../mocks/mocks";
import {GroupMembersPage} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersPage";
import {ModellingGroupDetailsPageProps} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import {checkAsync, checkPromise} from "../../../../testHelpers";
import {expectOneAction} from "../../../../actionHelpers";
import {alt} from "../../../../../main/shared/alt";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {mockModellingGroup, mockModellingGroupDetails, mockUser} from "../../../../mocks/mockModels";
import {mockGroupDetailsEndpoint, mockGroupsEndpoint, mockUsersEndpoint} from "../../../../mocks/mockEndpoints";

describe("GroupMembersPage", () => {
    const sandbox = new Sandbox();
    const groupId = "group-1";
    const match = mockMatch<ModellingGroupDetailsPageProps>({groupId: groupId});
    const location = mockLocation();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers").returns(Promise.resolve(true));
        const fetchGroups = sandbox.sinon.stub(groupStore, "fetchGroups").returns(Promise.resolve([]));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails").returns(Promise.resolve({}));
        const dispatchSpy = sandbox.dispatchSpy();

        const promise = new GroupMembersPage({match, location, history: null, router: null}).load(match.params);
        checkPromise(done, promise, (_, afterWait) => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(done, () => {
                expectOneAction(dispatchSpy, {action: "ModellingGroupActions.setCurrentGroup", payload: groupId});
                expect(fetchGroupDetails.called).to.equal(true, "Expected groupStore.fetchGroupDetails to be triggered");
            });
        });
    });


    const page = new GroupMembersPage({location, router: null, match, history: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockUsersEndpoint([mockUser()]),
            mockGroupsEndpoint([mockModellingGroup({id: groupId})]),
            mockGroupDetailsEndpoint(mockModellingGroupDetails())
        ]);
    });
});