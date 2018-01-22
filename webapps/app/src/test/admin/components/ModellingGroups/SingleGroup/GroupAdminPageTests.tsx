import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../../Sandbox";
import {userStore} from "../../../../../main/admin/stores/UserStore";
import {groupStore} from "../../../../../main/admin/stores/GroupStore";
import {mockLocation} from "../../../../mocks/mocks";
import {GroupAdminPage} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminPage";
import {ModellingGroupDetailsPageProps} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ViewModellingGroupDetailsPage";
import {checkAsync, checkPromise} from "../../../../testHelpers";
import {expectOneAction} from "../../../../actionHelpers";
import {alt} from "../../../../../main/shared/alt";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {mockModellingGroup, mockModellingGroupDetails, mockUser} from "../../../../mocks/mockModels";
import {mockGroupDetailsEndpoint, mockGroupsEndpoint, mockUsersEndpoint} from "../../../../mocks/mockEndpoints";

describe("GroupAdminPage", () => {
    const sandbox = new Sandbox();
    const groupId = "group-1";
    const location = mockLocation<ModellingGroupDetailsPageProps>({groupId: groupId});

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers").returns(Promise.resolve(true));
        const fetchGroups = sandbox.sinon.stub(groupStore, "fetchGroups").returns(Promise.resolve([]));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails").returns(Promise.resolve({}));
        const dispatchSpy = sandbox.dispatchSpy();

        const promise = new GroupAdminPage().load({groupId: groupId});

        checkPromise(done, promise, (_, afterWait) => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(done, () => {
                expectOneAction(dispatchSpy, {action: "ModellingGroupActions.setCurrentGroup", payload: groupId});
                expect(fetchGroupDetails.called).to.equal(true, "Expected groupStore.fetchGroupDetails to be triggered");
            });
        });
    });


    const page = new GroupAdminPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockUsersEndpoint([mockUser()]),
            mockGroupsEndpoint([mockModellingGroup({id: groupId})]),
            mockGroupDetailsEndpoint(mockModellingGroupDetails())
        ]);
    });
});