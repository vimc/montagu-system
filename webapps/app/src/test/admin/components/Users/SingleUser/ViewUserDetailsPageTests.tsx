import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { mockLocation } from "../../../../mocks/mocks";
import * as React from "react";
import { expectOneAction } from "../../../../actionHelpers";
import { checkAsync } from "../../../../testHelpers";
import { userStore } from "../../../../../main/admin/stores/UserStore";
import {
    UserDetailsPageProps,
    ViewUserDetailsPage
} from "../../../../../main/admin/components/Users/SingleUser/ViewUserDetailsPage";

describe("ViewUserDetailsPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers").returns(Promise.resolve(true));
        const fetchUserDetails = sandbox.sinon.stub(userStore, "fetchUserDetails");
        const dispatchSpy = sandbox.dispatchSpy();

        const location = mockLocation<UserDetailsPageProps>({ username: "testuser" });
        sandbox.mount(<ViewUserDetailsPage location={ location }/>);

        checkAsync(done, (afterWait) => {
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(() => {
                expectOneAction(dispatchSpy, { action: "ModellingGroupActions.setCurrentUser", payload: "testuser" });
                expect(fetchUserDetails.called).to.equal(true, "Expected groupStore.fetchUserDetails to be triggered");
            });
        });
    });
});
