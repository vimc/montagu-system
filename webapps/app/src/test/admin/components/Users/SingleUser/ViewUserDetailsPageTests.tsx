import { Sandbox } from "../../../../Sandbox";
import { expect } from "chai";
import { mockLocation } from "../../../../mocks/mocks";
import * as React from "react";
import { expectOneAction } from "../../../../actionHelpers";
import {checkAsync, checkPromise} from "../../../../testHelpers";
import { userStore } from "../../../../../main/admin/stores/UserStore";
import {
    UserDetailsPageProps,
    ViewUserDetailsPage
} from "../../../../../main/admin/components/Users/SingleUser/ViewUserDetailsPage";
import { alt } from "../../../../../main/shared/alt";
import { mockUser } from "../../../../mocks/mockModels";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {successResult} from "../../../../mocks/mockRemote";
import {mockUsersEndpoint} from "../../../../mocks/mockEndpoints";

describe("ViewUserDetailsPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const location = mockLocation<UserDetailsPageProps>({ username: "testuser" });

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

        const promise = new ViewUserDetailsPage().load({username: "testuser"});
        checkPromise(done, promise, (_, afterWait) => {
            expect(fetchUsers.called).to.equal(true, "Expected userStore.fetchUsers to be triggered");
            afterWait(done, () => {
                expectOneAction(dispatchSpy, { action: "UserActions.setCurrentUser", payload: "testuser" });
             });
        });
    });

    const page = new ViewUserDetailsPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockUsersEndpoint([mockUser()])
        ]);
    });
});
