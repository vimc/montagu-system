import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../../Sandbox";
import {checkPromise} from "../../../../testHelpers";
import {ViewAllUsersPage} from "../../../../../main/admin/components/Users/List/ViewAllUsersPage";
import {userStore} from "../../../../../main/admin/stores/UserStore";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {doNothing} from "../../../../../main/shared/Helpers";
import {mockLocation} from "../../../../mocks/mocks";

describe("ViewAllUsersPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const spy = sandbox.sinon.spy(userStore, "fetchUsers");
        const promise = new ViewAllUsersPage().load(undefined);
        checkPromise(done, promise, () => {
            expect(spy.called).to.equal(true, "Expected usersStore.fetchUsers to be triggered");
        });
    });

    const page = new ViewAllUsersPage({location: mockLocation(), router: null});
    addNavigationTests(page, sandbox, doNothing);
});
