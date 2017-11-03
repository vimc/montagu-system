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
import { alt } from "../../../../../main/shared/alt";
import { mockUser } from "../../../../mocks/mockModels";

describe("ViewUserDetailsPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {

        alt.bootstrap(JSON.stringify({
            UserStore: {
                currentUsername: "testuser",
                usersLookup: {
                    "testuser": mockUser(),
                },
                rolesLookup: {
                }
            }
        }));

        const fetchUsers = sandbox.sinon.stub(userStore, "fetchUsers")
            .returns(Promise.resolve(true));

        const dispatchSpy = sandbox.dispatchSpy();

        const location = mockLocation<UserDetailsPageProps>({ username: "testuser" });
        new ViewUserDetailsPage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(done, () => {
                expectOneAction(dispatchSpy, { action: "UserActions.setCurrentUser", payload: "testuser" });
             });
        });
    });
});
